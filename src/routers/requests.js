const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); //importing the userAuth middleware to authenticate the user
const { ConnectionRequestModel } = require("../models/connectionRequest"); //importing the connectionRequest model to create a new connection request
const { User } = require("../models/user"); //importing the user model to get the user details of the logged in user

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //getting the user id of the logged in user from the request object
      const toUserId = req.params.toUserId; //getting the user id of the user to whom the request is being sent from the request parameters
      const status = req.params.status; //getting the status of the request from the request parameters

      //checking if the status is valid
      const validStatuses = ["ignored","interested"];
      if(!validStatuses.includes(status)){
        return res.status(400).json({
          message:"Invalid status. Valid statuses are: ignored, interested"
        })
      };

      //checking if the toUser is valid and exists in the database
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(400).json({
          message:"User not exists"
        })
      };

      //checking if toUserId sents request to fromUserId , check for duplicate requests from-->to and to-->from
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or:[
          {fromUserId, toUserId},
          {fromUserId:toUserId, toUserId :fromUserId}
        ]
      });
      if(existingConnectionRequest){
        return res.status(400).json({
          message:"Connection request already exists"
        })
      }   
      

      //creating a new connection request using the connectionRequest model and saving it to the database
      const connectionRequest = new ConnectionRequestModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save(); //saving the connection request to the database

      res.json({
        message: `Connection request sent successfully + ${data.status}`,
        data: data,
      });
    } catch (err) {
      res.status(500).send("Error sending connection request: " + err); //sending an error response in case of failure
    }
  },
);

module.exports = requestsRouter;
