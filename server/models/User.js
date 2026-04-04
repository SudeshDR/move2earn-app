const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  walletAddress: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  achievedGoals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal"
  }],
  totalSteps: { type: Number, default: 0 },
  coins: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
