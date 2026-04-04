require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ Load Models (IMPORTANT)
require("./models/User");
require("./models/StepLog");
require("./models/Transaction");
require("./models/Goal");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const stepRoutes = require("./routes/stepRoutesV2");
const walletRoutes = require("./routes/walletRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const goalRoutes = require("./routes/goalRoutes");

// ✅ Middleware
app.use(express.json());

// ✅ CORS (for development + production)
app.use(cors({
  origin: "*"
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/goals", goalRoutes);

// ✅ Root Route (for testing)
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
