const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookie = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");
const signupValidation = require("./utils/signupValidation");
const loginValidation = require("./utils/loginValidation");

const { authorized } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookie());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Signup route
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

app.get("/profile/view", authorized, async (req, res) => {
  try {
    const user = res.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    res.send(user);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
});

app.get("/users", authorized, async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
