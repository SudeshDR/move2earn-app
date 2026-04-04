const express = require("express");
const Goal = require("../models/Goal");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ stepsRequired: 1, createdAt: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
