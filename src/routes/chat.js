const express = require("express");
const { authorized } = require("../middleware/auth");
const Chat = require("../models/chat");
const Connection = require("../models/connectionRequest");

const router = express.Router();

router.get("/chat/:toUserId", authorized, async (req, res) => {
  try {
    const { toUserId } = req?.params;
    const loggedInUserId = res.user._id;

    if (toUserId === loggedInUserId) {
      throw new Error("Cant take current user id");
    }

    const toUser = await Connection.findOne({
      $or: [
        { toUserId: toUserId, status: "accepted" },
        { fromUserId: toUserId, status: "accepted" },
      ],
    });

    if (!toUser) {
      throw new Error("User not found");
    }

    let chat = await Chat.findOne({
      participants: { $all: [loggedInUserId, toUserId] },
    });

    if (!chat) {
      chat = await Chat({
        participants: [loggedInUserId, toUserId],
        messages: [],
      });

      await chat.save();
    }

    res.send(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
