const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET TOP USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalSteps: -1 }) // sort by steps (better than coins)
      .limit(10)
      .select("name totalSteps coins");

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;