const express = require("express");
const bcrypt = require("bcrypt");
const signupValidation = require("../utils/signupValidation");
const loginValidation = require("../utils/loginValidation");
const User = require("../models/user");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // Validate request body
    signupValidation(req);

    const { password, username } = req.body;

    const existingUser = await User.findOne({
      username: username?.toLowerCase(),
    });

    const existingEmail = await User.findOne({
      email: req.body.email?.toLowerCase(),
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Error creating user:", err);
    console.log(err.message);

    res.status(501).send({
      message: err.message || "Internal server error",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    loginValidation(req);

    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch)
      return res.status(401).send({ message: "Invalid credentials" });

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.send(userWithoutPassword);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(501).send({ message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send({ message: "Logout Successful" });
});

module.exports = router;
