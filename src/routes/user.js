const express = require("express");
const { authorized } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.get("/user/requests/received", authorized, async (req, res) => {
  try {
    const loggedInUser = res.user._id;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", ["name", "email", "username"]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/requests/pending", authorized, async (req, res) => {
  try {
    const loggedInUser = res.user._id;

    const data = await ConnectionRequest.find({
      fromUserId: loggedInUser,
      status: "interested",
    }).populate("toUserId", ["name", "email", "username"]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
