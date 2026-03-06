const path = require("path");
const dotenv = require("dotenv");

// Load environment variables at the very top
dotenv.config({ path: path.join(__dirname, "config/confiq.env") });
// THEN load redis
// require("./config/redisClient.js");
const express = require("express");
const { app, server } = require("./server");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDatabase = require("./config/db");
const errorMiddleware = require("./middleware/error");
// Load environment variables

// CORS options
// const corsOptions = {
//   origin: [
//     "http://localhost:5173", // web dev
//     "http://localhost:5174",
//     "http://localhost:3000",
//     "http://localhost:8000",
//     "https://prolinksocialclient.onrender.com",
//     "http://10.245.214.233",
//     "http://10.195.79.233:8000",
//     process.env.FRONTEND_URL,
//     process.env.MOBILE_CLIENT_URL, // Add this line
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

connectDatabase();
// Middleware
// app.use(cors(corsOptions)); // Apply CORS once
app.use(cors({ origin: true, credentials: true }));
// app.use(
//   cors({
//     origin: "*", // allow all for testing
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use(express.json()); // Parse JSON data once
app.use(cookieParser()); // Cookie parsing
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const register = require("./routes/authRoutes");
const textbooks = require("./routes/textbookRoutes");

// const studentprogressRoutes = require("./routes/studentprogressRoutes.js");
// Routes
app.use("/api/v1/auth", register);
app.use("/api/v1/textbooks", textbooks);
if (process.env.NODE_ENV === "production") {
  console.log("Hello production");
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // For any route, serve the index.html (SPA fallback)
  app.get("*", (req, res) => {
    console.log("Hello production2");
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running...ok");
  });
}
app.use(errorMiddleware);
// Start server
const PORT = process.env.PORT || 5000;
console.log("PORT from env:", process.env.PORT);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
