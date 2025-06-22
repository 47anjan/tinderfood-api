const express = require("express");
const { authorized } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

const profileInfo = [
  "name",
  "email",
  "username",
  "cookingLevel",
  "avatar",
  "bio",
];

router.get("/user/requests/received", authorized, async (req, res) => {
  try {
    const loggedInUser = res.user._id;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", profileInfo);

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
    }).populate("toUserId", profileInfo);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/connections", authorized, async (req, res) => {
  try {
    const loggedInUser = res.user._id;

    const data = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("toUserId", profileInfo)
      .populate("fromUserId", profileInfo);

    const user = data.map((con) => {
      if (con.fromUserId._id.toString() === loggedInUser.toString())
        return con.toUserId;
      return con.fromUserId;
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
