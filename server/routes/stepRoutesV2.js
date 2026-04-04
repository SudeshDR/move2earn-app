const express = require("express");
const mongoose = require("mongoose");
const StepLog = require("../models/StepLog");
const Goal = require("../models/Goal");

const router = express.Router();
const User = mongoose.model("User");

router.post("/add-steps", async (req, res) => {
  try {
    const { userId, steps } = req.body;
    const stepCount = Number(steps);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const previousSteps = user.totalSteps;
    const coinsEarned = Math.floor(stepCount / process.env.COIN_RATE);

    user.totalSteps += stepCount;
    user.coins += coinsEarned;

    const allGoals = await Goal.find().sort({ stepsRequired: 1 });
    const achievedGoalIds = (user.achievedGoals || []).map((id) => id.toString());
    const newlyUnlockedGoals = allGoals.filter((goal) => (
      previousSteps < goal.stepsRequired &&
      user.totalSteps >= goal.stepsRequired &&
      !achievedGoalIds.includes(goal._id.toString())
    ));

    const bonusCoins = newlyUnlockedGoals.reduce(
      (sum, goal) => sum + Number(goal.bonusCoins || 0),
      0
    );

    if (newlyUnlockedGoals.length > 0) {
      user.coins += bonusCoins;
      user.achievedGoals.push(...newlyUnlockedGoals.map((goal) => goal._id));
    }

    await user.save();

    await StepLog.create({
      userId,
      steps: stepCount,
      coinsEarned: coinsEarned + bonusCoins
    });

    res.json({
      totalSteps: user.totalSteps,
      coins: user.coins,
      bonusCoins,
      unlockedGoals: newlyUnlockedGoals.map((goal) => ({
        _id: goal._id,
        title: goal.title,
        badgeLabel: goal.badgeLabel,
        bonusCoins: goal.bonusCoins
      }))
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
