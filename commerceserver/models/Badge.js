// models/Badge.js
const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  icon: String,

  // Criteria
  requirementType: {
    type: String,
    enum: ["points", "streak", "level", "accuracy", "speed"],
    required: true,
  },
  requirementValue: {
    type: Number,
    required: true,
  },

  // Rarity
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common",
  },

  // Points Bonus
  pointsBonus: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Badge", badgeSchema);
