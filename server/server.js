[12:08, 29/03/2026] Sudesh: require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

require("./models/User");
require("./models/StepLog");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/leaderboard", leaderboardRoutes);
// ✅ ADD CORS HERE
app.use(cors({
  origin: "https://move2earn.netlify.app"
}));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/steps", require("./routes/stepRoutes"));
app.use("/api/wallet", require("./route…
[12:08, 29/03/2026] Sudesh: require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const leaderboardRoutes = require("./routes/leaderboardRoutes");

require("./models/User");
require("./models/StepLog");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (ONLY ONE)
app.use(cors({
  origin: "*"
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/steps", require("./routes/stepRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Root route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});