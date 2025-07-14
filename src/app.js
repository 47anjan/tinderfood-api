const express = require("express");

const cors = require("cors");
const cookie = require("cookie-parser");
const http = require("http");
const connectDB = require("./config/database");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookie());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const usersRoutes = require("./routes/users");
const requestRoutes = require("./routes/request");
const favoriteRoutes = require("./routes/favorite");
const chatRoutes = require("./routes/chat");
const initializeSocket = require("./utils/socket");

app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/", profileRoutes);
app.use("/api/", usersRoutes);
app.use("/api/", requestRoutes);
app.use("/api/", favoriteRoutes);
app.use("/api/", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
