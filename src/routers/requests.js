const express= require("express");
const requestsRouter = express.Router();
const {userAuth}= require("../middlewares/auth"); //importing the userAuth middleware to authenticate the user


requestsRouter.post("/sendConnectionRequest",userAuth, async(req,res)=>{
  try{
const user= req.user; //getting the user from the request object set by the userAuth middleware
//getting the userId of the user to whom the connection request is to be sent from the request body

res.send({message: "Connection request sent successfully"}); //sending a success response
  }
  catch(err){
    res.status(500).send("Error sending connection request: ",err); //sending an error response in case of failure
  }
})

module.exports= requestsRouter;
