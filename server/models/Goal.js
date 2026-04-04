const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  badgeLabel: {
    type: String,
    required: true,
    trim: true
  },
  stepsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  bonusCoins: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    default: "#00ffcc"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Goal", goalSchema);
