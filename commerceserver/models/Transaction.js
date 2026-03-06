// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },

  // Question Details
  question: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: [
      "debit-credit",
      "journal-entry",
      "ledger-posting",
      "trial-balance",
      "final-accounts",
    ],
    required: true,
  },

  // Answer Options
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],

  // For Debit/Credit type
  correctDebit: String,
  correctCredit: String,

  // For Journal Entry
  correctEntry: {
    debit: String,
    credit: String,
    amount: Number,
  },

  // Metadata
  topic: {
    type: String,
    enum: [
      "cash",
      "purchases",
      "sales",
      "expenses",
      "assets",
      "liabilities",
      "capital",
    ],
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },

  // Learning Resources
  explanation: String,
  hint: String,
  videoLink: String,

  // Stats
  timesAnswered: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  successRate: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to update success rate
transactionSchema.methods.updateSuccessRate = function () {
  this.successRate = (this.correctCount / this.timesAnswered) * 100;
};

module.exports = mongoose.model("Transaction", transactionSchema);
