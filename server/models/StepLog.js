const mongoose = require("mongoose");

const stepLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  steps: Number,
  coinsEarned: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StepLog", stepLogSchema);