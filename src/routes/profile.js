const express = require("express");
const { authorized } = require("../middleware/auth");
const validateEditProfile = require("../utils/validateEditProfile");
const User = require("../models/user");

const router = express.Router();

router.get("/profile/view", authorized, async (req, res) => {
  try {
    const user = res.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.send(userWithoutPassword);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
});

router.get("/profile/edit", authorized, async (req, res) => {
  try {
    validateEditProfile(req);

    const { username } = req.body;
    const loggedInUser = res.user;

    if (username && username !== loggedInUser.username) {
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(400).send({
          message:
            "Username is already taken. Please choose a different username.",
        });
      }
    }

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.send(loggedInUser);
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }
});

module.exports = router;
