const express = require("express");
const mongoose = require("mongoose");
const StepLog = require("../models/StepLog");

const router = express.Router();

// Get User model
const User = mongoose.model("User");

// Add Steps
router.post("/add-steps", async (req, res) => {
  try {
    const { userId, steps } = req.body;

    const user = await User.findById(userId);

    const coinsEarned = Math.floor(steps / process.env.COIN_RATE);

    user.totalSteps += Number(steps);
    user.coins += coinsEarned;

    await user.save();

    // ✅ SAVE MINING HISTORY
    await StepLog.create({
      userId,
      steps,
      coinsEarned
    });
const log = await StepLog.create({
  userId,
  steps,
  coinsEarned
});

console.log("Step log saved:", log);
    res.json({
      totalSteps: user.totalSteps,
      coins: user.coins
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const logs = await StepLog.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;