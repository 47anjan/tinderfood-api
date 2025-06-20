const express = require("express");
const { authorized } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/request/send/:status/:toUserId", authorized, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = res.user._id;

    const allowedStatus = ["interested"];

    if (!allowedStatus.includes(status)) {
      throw new Error("invalid status " + status);
    }

    if (fromUserId.equals(toUserId)) {
      throw new Error("Cant send request to yourself");
    }

    const connectionRequest = await ConnectionRequest({
      toUserId,
      fromUserId,
      status,
    });

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    const toUser = await User.findOne({
      _id: toUserId,
    });

    if (!toUser) {
      throw new Error("To user is not a valid user");
    }

    if (existingConnectionRequest) {
      throw new Error("Connection Request Already Exist!");
    }

    const data = await connectionRequest.save();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
