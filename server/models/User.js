const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  walletAddress: String,
  totalSteps: { type: Number, default: 0 },
  coins: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);