const express= require("express");
const bcrypt = require("bcrypt"); //importing the bcrypt library to hash the password
const { validateSignUpData, validateLoginData } = require("../utils/validation"); //importing the validation functions from the validation.js file
const { User } = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
    const isPasswordMatched = await user.validatePassword(password);
    // Create a JWT token for the user and send it in the response header
    const token= await user.getJWTToken(); 
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


module.exports = authRouter; //exporting the authRouter to be used in other parts of the application
