// models/Tournament.js
const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: String,
  description: String,

  startTime: Date,
  endTime: Date,

  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      score: Number,
      rank: Number,
    },
  ],

  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming",
  },

  prizes: [
    {
      rank: Number,
      points: Number,
      badge: String,
    },
  ],
});

module.exports = mongoose.model("Tournament", tournamentSchema);
