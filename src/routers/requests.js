const express = require("express");
const mongoose = require("mongoose");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); //importing the userAuth middleware to authenticate the user
const { ConnectionRequestModel } = require("../models/connectionRequest"); //importing the connectionRequest model to create a new connection request
const { User } = require("../models/user"); //importing the user model to get the user details of the logged in user

//sending a connection request from the logged in user to another user
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //getting the user id of the logged in user from the request object
      const toUserId = req.params.toUserId; //getting the user id of the user to whom the request is being sent from the request parameters
      const status = req.params.status; //getting the status of the request from the request parameters

      //checking if the status is valid
      const validStatuses = ["ignored", "interested"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Valid statuses are: ignored, interested",
        });
      }

      //checking if the toUser is valid and exists in the database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not exists",
        });
      }

      //checking if toUserId sents request to fromUserId , check for duplicate requests from-->to and to-->from
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
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

//review the connection request by the user to accept or reject the request :: received by the user to whom the request is sent
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //status can be accepted or rejected : valiadation of status
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Valid statuses are: accepted or rejected",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          message: "Invalid connection request ID",
        });
      }

      //find the connection request by id
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: { $in: ["interested"] }, //only allow to review the request if the status is interested
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found or already reviewed",
        });
      }
      connectionRequest.status = status; //update the status of the connection request
      const data = await connectionRequest.save(); //save the updated connection request to the database
      res.json({
        message: `Connection request ${status} successfully`,
        data: data,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error reviewing connection request: " + err });
    }
  },
);

module.exports = requestsRouter;
