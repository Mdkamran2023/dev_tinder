const express =require("express");
const profileRouter = express.Router();
const {userAuth}= require("../middlewares/auth"); //importing the userAuth middleware to authenticate the user 


profileRouter.get("/profile",userAuth, async(req,res)=>{
  try{
  const user = req.user; //getting the user from the request object set by the userAuth middleware
  console.log(req.user);
  res.send(user); //sending the user data as a response
}catch(err){
  res.status(500).send("Error fetching user data: ", err); //sending an error response in case of failure
}
})


module.exports= profileRouter;

