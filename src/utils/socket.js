const socket = require("socket.io");

const crypto = require("crypto");
const Chat = require("../models/chat");

const generateRoomId = (fromUserId, toUserId) => {
  return crypto
    .createHash("sha256")
    .update([fromUserId, toUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("joinChat", ({ name, fromUserId, toUserId }) => {
      const roomId = generateRoomId(fromUserId, toUserId);

      console.log(`${name} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (message) => {
      const roomId = generateRoomId(message.fromUserId, message.toUserId);

      let chat = await Chat.findOne({
        participants: { $all: [message.fromUserId, message.toUserId] },
      });

      if (!chat) {
        chat = await Chat({
          participants: [message.fromUserId, message.toUserId],
          messages: [],
        });
      }

      chat.messages.push({
        senderId: message.fromUserId,
        text: message.text,
      });

      const data = await chat.save();

      const msg = data.messages[data.messages.length - 1];

      socket.to(roomId).emit("receiveMessage", msg);
    });

    socket.on("startTyping", ({ fromUserId, toUserId }) => {
      const roomId = generateRoomId(fromUserId, toUserId);
      socket.to(roomId).emit("startTyping", {
        fromUserId,
        toUserId,
      });
    });

    socket.on("stopTyping", ({ fromUserId, toUserId }) => {
      const roomId = generateRoomId(fromUserId, toUserId);
      socket.to(roomId).emit("stopTyping", {
        fromUserId,
        toUserId,
      });
    });
  });
};

module.exports = initializeSocket;
