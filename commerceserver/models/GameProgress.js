// models/GameProgress.js
const mongoose = require("mongoose");

const gameProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Level Progress
  currentLevel: {
    type: Number,
    default: 1,
  },
  levelsCompleted: [
    {
      levelNumber: Number,
      completedAt: Date,
      score: Number,
      attempts: Number,
    },
  ],

  // Chapter Progress (Accounting Topics)
  chapters: {
    basicAccounting: { type: Boolean, default: false },
    journalEntries: { type: Boolean, default: false },
    ledger: { type: Boolean, default: false },
    trialBalance: { type: Boolean, default: false },
    finalAccounts: { type: Boolean, default: false },
    depreciation: { type: Boolean, default: false },
    partnership: { type: Boolean, default: false },
    companyAccounts: { type: Boolean, default: false },
  },

  // Question History
  answeredQuestions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
      correct: Boolean,
      timeTaken: Number, // in seconds
      pointsEarned: Number,
      attemptedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Weak Areas (for personalized learning)
  weakAreas: [
    {
      topic: String,
      mistakeCount: Number,
    },
  ],

  // Streak History
  streakHistory: [
    {
      date: Date,
      streakCount: Number,
    },
  ],
});

module.exports = mongoose.model("GameProgress", gameProgressSchema);
