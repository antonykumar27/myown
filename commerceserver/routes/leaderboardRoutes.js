// routes/leaderboardRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const leaderboardController = require("../controllers/leaderboardController");

router.get("/global", protect, leaderboardController.getGlobalLeaderboard);
router.get("/friends", protect, leaderboardController.getFriendsLeaderboard);

module.exports = router;
