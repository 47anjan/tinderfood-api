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

    const { page = 1, limit = 10 } = req.query;

    if (limit > 1000 || page > 1000) {
      (page = 1), (limit = 10);
    }

    const skip = (page - 1) * limit;

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
    })
      .select("-password -__v")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/users/:userId", authorized, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = res.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const data = await User.findOne({
      _id: userId,
    });

    if (!data) {
      return res.status(401).send({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = data.toObject();

    res.send(userWithoutPassword);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
