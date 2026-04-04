const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const resolveRole = (email) => {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  return adminEmail && email.toLowerCase() === adminEmail ? "admin" : "user";
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      walletAddress,
      role: resolveRole(email)
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const resolvedRole = resolveRole(email);
    if (user.role !== resolvedRole) {
      user.role = resolvedRole;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
