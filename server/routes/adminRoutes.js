const express = require("express");
const User = require("../models/User");
const StepLog = require("../models/StepLog");
const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalStepsAgg,
      totalCoinsAgg,
      totalWithdrawalsAgg,
      newUsersLast7Days
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$totalSteps" } } }]),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$coins" } } }]),
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    res.json({
      totalUsers,
      totalSteps: totalStepsAgg[0]?.total || 0,
      totalCoins: totalCoinsAgg[0]?.total || 0,
      totalWithdrawn: totalWithdrawalsAgg[0]?.total || 0,
      newUsersLast7Days
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { walletAddress: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(query)
      .select("-password")
      .sort({ totalSteps: -1, createdAt: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/withdrawals", async (req, res) => {
  try {
    const withdrawals = await Transaction.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/step-logs", async (req, res) => {
  try {
    const logs = await StepLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    const flaggedLogs = logs.map((log) => ({
      ...log.toObject(),
      suspicious: Number(log.steps) >= 20000
    }));

    res.json(flaggedLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ stepsRequired: 1, createdAt: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/goals", async (req, res) => {
  try {
    const { title, badgeLabel, stepsRequired, bonusCoins, color } = req.body;

    const goal = await Goal.create({
      title,
      badgeLabel,
      stepsRequired: Number(stepsRequired),
      bonusCoins: Number(bonusCoins || 0),
      color
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
