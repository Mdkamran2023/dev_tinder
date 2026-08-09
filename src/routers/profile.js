const express =require("express");
const profileRouter = express.Router();
const {userAuth}= require("../middlewares/auth"); //importing the userAuth middleware to authenticate the user 
const {validateUpdatedData}= require("../utils/validation"); //importing the validateUpdatedData function from the validation.js file
const validator = require("validator"); //importing the validator library to validate the password format
const bcrypt =require("bcrypt"); //importing the bcrypt library to hash the password


profileRouter.get("/profile/view",userAuth, async(req,res)=>{
  try{
  const user = req.user; //getting the user from the request object set by the userAuth middleware
  console.log(req.user);
  res.send(user); //sending the user data as a response
}catch(err){
  res.status(500).send("Error fetching user data: ", err); //sending an error response in case of failure
}
});

profileRouter.patch("/profile/update",userAuth, async(req,res)=>{
  try{
   if(!validateUpdatedData(req)) {
     return res.status(400).send("Invalid data provided for update");
   }
    const loggedInUser = req.user; //getting the user from the request object set by the userAuth middleware
    console.log("Logged in user data: ", loggedInUser); 
    const datatoUpdate = req.body; //getting the data to update from the request body
    const updatedUser = Object.keys(req.body).every ((field)=> loggedInUser[field] = datatoUpdate[field]); //updating the user data with the new data provided in the request body
    await loggedInUser.save(); //saving the updated user data to the database
    console.log("Updated user data: ", loggedInUser);
    res.status(200).send(`${loggedInUser.firstName}, User data updated successfully`); //sending a success response
  }
  catch(err){
    res.status(500).send("Error updating user data: ", err); //sending an error response in case of failure
  }
 });

profileRouter.patch("/profile/update/password",userAuth, async(req,res)=>{
  try{
    const {password}= req.body; //getting the new password from the request body
    // checking if password is provided and validating the new password format using the validator library
    if(!password || password.length <6 || !validator.isStrongPassword(password)){
      return res.status(400).send("Password must be at least 6 characters long and include a mix of uppercase, lowercase, and numbers");
    }
    //retreiving the user attached by userAuth middleware and updating the password
    const loggedInUser = req.user; //getting the user from the request object set by the userAuth middleware

    //encrypt the new password before saving it to the database
    const saltRounds=10; //number of salt rounds for hashing the password
    const passwordHash = await bcrypt.hash(password, saltRounds); //hashing the new password using bcrypt
    loggedInUser.password = passwordHash; //updating the user password with the new hashed password
    await loggedInUser.save(); //saving the updated user data to the database
    res.status(200).send(`${loggedInUser.firstName}, User password updated successfully`); //sending a success response
  }
  catch(err){
    res.status(500).send("Error updating user password: " + err.message); //sending an error response in case of failure
  }
})


module.exports= profileRouter;

