const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8000",
      process.env.FRONTEND_URL || "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

app.get("/", (req, res) => res.send("Server is running"));

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    console.log(`➡️ User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });

  socket.on("user-toggle-audio", (userId, roomId) => {
    console.log(`🔈 User ${userId} toggled audio in ${roomId}`);
    socket.to(roomId).emit("user-toggle-audio", userId);
  });

  socket.on("user-toggle-video", (userId, roomId) => {
    console.log(`🎥 User ${userId} toggled video in ${roomId}`);
    socket.to(roomId).emit("user-toggle-video", userId);
  });

  socket.on("user-leave", (userId, roomId) => {
    console.log(`❌ User ${userId} left room ${roomId}`);
    socket.to(roomId).emit("user-leave", userId);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

module.exports = { app, server, io };
