const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Get User model
const User = mongoose.model("User");

// Add Steps
router.post("/add-steps", async (req, res) => {
  try {
    const { userId, steps } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.totalSteps += Number(steps);

    // Mining logic
    const coinRate = Number(process.env.COIN_RATE);
    user.coins = Math.floor(user.totalSteps / coinRate);

    await user.save();

    res.json({
      totalSteps: user.totalSteps,
      coins: user.coins
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;