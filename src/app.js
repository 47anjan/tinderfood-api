const express = require("express");

const cors = require("cors");
const cookie = require("cookie-parser");
const connectDB = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookie());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const usersRoutes = require("./routes/users");
const requestRoutes = require("./routes/request");

app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/", profileRoutes);
app.use("/api/", usersRoutes);
app.use("/api/", requestRoutes);

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
