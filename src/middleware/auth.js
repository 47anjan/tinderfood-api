const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authorized = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = await jwt.verify(
      token,
      "16d74673bc7728c75ac00ad0633225f4a2a3ea1086216abf04267c8756f1a210"
    );

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    res.user = user;

    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = { authorized };
