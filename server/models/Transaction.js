const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  walletAddress: String,
  txHash: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
