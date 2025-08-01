const socket = require("socket.io");

const crypto = require("crypto");
const Chat = require("../models/chat");
const Connection = require("../models/connectionRequest");

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

  const userSockets = new Map();
  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    socket.on("registerUser", (userId) => {
      userSockets.set(userId, socket.id);
      onlineUsers.add(userId);

      console.log(`User ${userId} registered with socket ${socket.id}`);

      // Send updated online users list to everyone
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          onlineUsers.delete(userId);

          // Send updated online users list to everyone
          io.emit("onlineUsers", Array.from(onlineUsers));
          break;
        }
      }
    });

    socket.on("joinChat", ({ name, fromUserId, toUserId }) => {
      const roomId = generateRoomId(fromUserId, toUserId);

      console.log(`${name} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (message) => {
      const roomId = generateRoomId(message.fromUserId, message.toUserId);

      const toUser = await Connection.findOne({
        $or: [
          { toUserId: message.toUserId, status: "accepted" },
          { fromUserId: message.toUserId, status: "accepted" },
        ],
      });

      if (!toUser) {
        throw new Error("User not found");
      }

      let chat = await Chat.findOne({
        participants: { $all: [message.fromUserId, message.toUserId] },
      }).populate({
        path: "messages.senderId",
        select: "name username avatar",
      });

      if (!chat) {
        chat = await Chat({
          participants: [message.fromUserId, message.toUserId],
          messages: [],
        }).populate({
          path: "messages.senderId",
          select: "name username avatar",
        });
      }

      chat.messages.push({
        senderId: message.fromUserId,
        text: message.text,
      });

      const savedChat = await chat.save();

      await savedChat.populate({
        path: "messages.senderId",
        select: "name username avatar",
      });

      const msg = await savedChat?.messages?.at(-1);

      // const msg = savedChat.messages[savedChat.messages.length - 1];

      socket.to(roomId).emit("receiveMessage", msg);

      // FIXED: Send notification to the RECIPIENT, not the sender
      const recipientSocketId = userSockets.get(message.toUserId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messageNotification", {
          fromUserId: message.fromUserId,
          toUserId: message.toUserId,
          message: message.text,
          username: msg.senderId.username,
          name: msg.senderId.name,
          avatar: msg.senderId.avatar,
          timestamp: msg.timestamp || new Date(),
          messageId: msg._id,
          chatId: savedChat._id,
        });
      } else {
        console.log(
          `User ${message.toUserId} is not online, notification not sent`
        );
      }
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
