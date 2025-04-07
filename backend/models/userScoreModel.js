const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  badges: [String],
});

const UserScore = mongoose.model("UserScore", userScoreSchema);
module.exports = UserScore;
