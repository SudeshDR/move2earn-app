const express = require("express");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Models
const User = mongoose.model("User");

// ================= BLOCKCHAIN SETUP =================

// Connect to Polygon Amoy
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Backend wallet (DO NOT expose this anywhere)
const backendWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);
console.log(backendWallet.address);
// Minimal ERC20 ABI
const tokenABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

const tokenContract = new ethers.Contract(
  process.env.TOKEN_ADDRESS,
  tokenABI,
  backendWallet
);

// ================= WITHDRAW + REAL TOKEN TRANSFER =================

router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.coins < amount) {
      return res.status(400).json({ msg: "Insufficient coins" });
    }

    // Convert coins to ERC20 amount (18 decimals)
    const tokenAmount = ethers.parseUnits(amount.toString(), 18);

    // Send tokens to user's wallet
    const tx = await tokenContract.transfer(
      user.walletAddress,
      tokenAmount
    );

    // Wait for confirmation
    await tx.wait();

    // Deduct coins AFTER success
    user.coins -= Number(amount);
    await user.save();

    // Save transaction in MongoDB
    await Transaction.create({
      userId,
      amount,
      walletAddress: user.walletAddress,
      txHash: tx.hash,
      status: "completed"
    });

    res.json({
      msg: "Tokens transferred successfully",
      txHash: tx.hash,
      remainingCoins: user.coins
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// ================= TRANSACTION HISTORY =================

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 });

    res.json(transactions);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
