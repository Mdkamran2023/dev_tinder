const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

const USER_FIELDS_TO_POPULATE =
  "firstName lastName emailId photoUrl skills about age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //getting the logged in user from the request object
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id, //finding all the connection requests where the logged in user is the recipient
      status: "interested", //only fetching the connection requests where the status is 'interested'
    }).populate(
      "fromUserId",
      "firstName lastName emailId photoUrl skills about age gender",
    );
    res.json({
      message: "Received requests fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching received requests: " + err,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user; //getting the logged in user from the request object
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: LoggedInUser._id, status: "accepted" },
        { toUserId: LoggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_FIELDS_TO_POPULATE)
      .populate("toUserId", USER_FIELDS_TO_POPULATE);
    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === LoggedInUser._id.toString()) {
        return request.toUserId; //if the logged in user is the sender, return the recipient's details
      }
      return request.fromUserId; //if the logged in user is the recipient, return the sender's details
    });
    res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching connections: " + err,
    });
  }
});

module.exports = { userRouter };
