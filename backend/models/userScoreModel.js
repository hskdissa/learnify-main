const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
    index: true, // Improves query performance
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
    default: [], // Ensures badges always have a default value
  },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const UserScore = mongoose.model("UserScore", userScoreSchema);
module.exports = UserScore;
