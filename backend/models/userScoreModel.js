const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
    index: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  badges: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const UserScore = mongoose.model("UserScore", userScoreSchema);
module.exports = UserScore;
