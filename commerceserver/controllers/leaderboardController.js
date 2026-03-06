// controllers/leaderboardController.js
const User = require("../models/User");

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const leaderboard = await User.find({ role: "student" })
      .sort({ points: -1, accuracy: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("name points level streak accuracy badges");

    const total = await User.countDocuments({ role: "student" });

    res.json({
      success: true,
      data: leaderboard,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFriendsLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("friends");

    const friendIds = user.friends.map((f) => f._id);
    friendIds.push(userId);

    const leaderboard = await User.find({ _id: { $in: friendIds } })
      .sort({ points: -1 })
      .select("name points level streak");

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
