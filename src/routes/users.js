const express = require("express");
const User = require("../models/user");
const { authorized } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.get("/users", authorized, async (req, res) => {
  try {
    const user = res.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const loggedInUserId = user._id;

    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const hideUserFromList = new Set();

    connections.forEach((con) => {
      hideUserFromList.add(con.fromUserId.toString());
      hideUserFromList.add(con.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromList) } },
        { _id: { $ne: loggedInUserId } },
      ],
    }).select("-password -__v");

    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
