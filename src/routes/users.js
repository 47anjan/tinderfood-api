const express = require("express");
const User = require("../models/user");
const { authorized } = require("../middleware/auth");

const router = express.Router();

router.get("/users", authorized, async (req, res) => {
  try {
    const user = res.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const users = await User.find(
      {
        _id: { $ne: user._id },
      },
      "-password -__v"
    );
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
