const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anjanislive:ArR9Fe4hBZt1RRkM@nodejs.rpurxiz.mongodb.net/node"
  );
};

module.exports = connectDB;
