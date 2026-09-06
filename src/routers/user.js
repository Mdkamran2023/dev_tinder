const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {ConnectionRequestModel} = require("../models/connectionRequest");


userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
         const loggedInUser= req.user; //getting the logged in user from the request object
         const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id, //finding all the connection requests where the logged in user is the recipient
            status:'interested' //only fetching the connection requests where the status is 'interested'
         }).populate('fromUserId','firstName lastName emailId photoUrl skills about age gender');
         res.json({
            message:"Received requests fetched successfully",
            data: connectionRequests
         });
    }
    catch(err){
        res.status(500).json({
            message:"Error fetching received requests: "+err
        })  
    }
});


module.exports ={userRouter};
