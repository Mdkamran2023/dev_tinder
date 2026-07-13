const express = require("express"); //importing the express module
const { connectDB } = require("./config/database"); //importing the database configuration file
const app = express(); //creating an instance of express application
const { User } = require("./models/user"); //importing the user model
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt"); //importing the bcrypt module for password hashing
const cookieParser= require("cookie-parser"); //importing the cookie-parser module to parse cookies from the request headers
const jwt= require("jsonwebtoken"); //importing the jsonwebtoken module to create and verify JWT tokens
const {userAuth}= require("./middlewares/auth"); //importing the userAuth middleware to authenticate the user


app.use(express.json()); //middleware to parse incoming JSON requests ,
//  this allows us to access the request body as a Javascript object in our route handlers.

//middleware to parse cookies from the request headers
app.use(cookieParser()); 

//route to get user data based on emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId; //getting the emailId from the request body
  try {
    const users = await User.findOne({ emailId: userEmail }).exec();
    //if the user is not found, send a 404 Not Found response, else send the user data as a response

    console.log("User data fetched successfully: ", users);
    if (!users) {
      res.status(404).send("No user found with the provided emailId"); //if no user is found, send a 404 Not Found response
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching user data: ", err);
  }
});

//route to delete user data based on userId
app.delete("/user", async (req, res) => {
  const userId = req.body.userId; //getting the userId from the request body
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: userId });
    if (!deletedUser) {
      res.status(404).send("No user found with the provided userId"); //if no user is found, send a 404 Not Found response
    } else {
      res.send({ message: "User deleted successfully", deletedUser });
    }
  } catch (err) {
    res.status(500).send("Error deleting user data:", err);
  }
});

//route to update user data based on userId
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // getting the userId from the URL parameters
  const updateData = req.body; // getting the data to be updated

  const userSkills = req.body?.skills?.length || 0; //getting the number of skills in the request body, if skills is not present, set it to 0

  // data sanitization- checking if the keys in the updateData object are allowed to be updated
  const ALLOWED_UPDATES = [
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    "password",
  ]; //defining the allowed keys to be updated
  const updates = Object.keys(updateData); //getting the keys of the updateData object
  const isValidOperation = updates.every((update) =>
    ALLOWED_UPDATES.includes(update),
  ); //checking if all the keys in the updateData object are allowed to be updated
  if (!isValidOperation) {
    return res.send({ error: "Invalid updates!" }); //if any of the keys in the updateData object are not allowed to be updated, send an error response
  }
  try {
    if (userSkills > 8) {
      return res
        .status(400)
        .send({ error: "You can add a maximum of 8 skills!" }); //if the number of skills is more than 8, send an error response
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      updateData,
      { returnDocument: "after", runValidators: true },
    ); //updating the user data and returning the updated document ,running the validators defined in the schema to ensure that the updated data is valid
    console.log(updateUser);
    if (!updateUser) {
      res.status(404).send("No user found with the provided userId"); //if no user is found,send a 404 Not Found response
    } else {
      res.send({ message: "User updated successfully", updateUser }); //sending a success response with the updated user data
    }
  } catch (err) {
    res.status(500).send("Error updating user"); //sending an error response in case of failure
  }
});

//feed API - Get /feed all the users from the database
app.get("/feed", async (req, res) => {
  const users = await User.find({});
  try {
    if (users.length === 0) {
      res.status(404).send("No users found in the database"); //if no user is found, send a 404 Not Found response
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching user data: ", err);
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body); //logging the request body to the console for debugging purposes

  try {
    // validation of the request body data using the validateSignUpData function from the validation.js file
    //saving the user instance to the database
    const { isValid, message } = validateSignUpData(req);
    if (!isValid) {
      return res.status(400).send({ error: message });
    }
    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password before saving it to the database
    const saltRounds = 10; //number of salt rounds for hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //creating a new user instance using the user model
    const userInstance = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword, //saving the hashed password to the database instead of the plain text password
    });

    //saving the user instance to the database
    await userInstance.save();
    res.status(201).send("User created successfully"); //sending a success response
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).send("Error creating user"); //sending an error response in case of failure
  }
});

app.get("/profile",userAuth, async(req,res)=>{
  try{
  const user = req.user; //getting the user from the request object set by the userAuth middleware
  console.log(req.user);
  res.send(user); //sending the user data as a response
}catch(err){
  res.status(500).send("Error fetching user data: ", err); //sending an error response in case of failure
}
})

app.post("/sendConnectionRequest",userAuth, async(req,res)=>{
  try{
const user= req.user; //getting the user from the request object set by the userAuth middleware
//getting the userId of the user to whom the connection request is to be sent from the request body

res.send({message: "Connection request sent successfully"}); //sending a success response
  }
  catch(err){
    res.status(500).send("Error sending connection request: ",err); //sending an error response in case of failure
  }
})

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body; //destructuring the request body to get the emailId and password
    //validation of the request body data using the validateLogindata function from the validateion.js file
    const { isValid, message } = validateLoginData(req);
    if (!isValid) {
      return res.status(400).send({ error: message });
    }
    const user = await User.findOne({ emailId: emailId }).exec(); //finding the user in the database based on the emailId
    if (!user) {
      return res.status(404).send("Invalid credentials."); //if the user is not found, send a 404 Not Found response
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // Create a JWT token for the user and send it in the response header
    const token= jwt.sign({_id:user._id},"DEVMANUS@!@#",{expiresIn:"1d"});//passing the user id as payload and a secret key to sign the token and setting the token to expire in 1 day
    // Add the token to cookie and send it in the response header
    console.log(token);
    res.cookie("token", token,{expires: new Date(Date.now()+ 24*60*60*1000)}); //setting the cookie to expire in 1 day
    if (!isPasswordMatched) {
      return res.status(401).send("Invalid credentials."); //if the password does not match, send a 401 Unauthorized response
    }
    res.status(200).send("User logged in successfully"); //sending a success response
  } catch (err) {
    res.status(500).send("Error logging in user" + err.message); //sending an error response in case of failure
  }
});

// after creating the express app, we need to connect to the database before strating the server.
//   We can do this by calling the connectDB function and then starting the server in the callback function of the promise returned by connectDB.
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777 ...");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });
