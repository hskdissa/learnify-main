const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const UserScore = require("../models/userScoreModel");
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
}

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

const authUser = asyncHandler(async (req, res) => {
  console.log("Login attempt with email:", req.body.email);  // Log incoming request
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);  // Log user data for debugging

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid Email or Password');
  }
});



// Get user's total points, level, and badges
const getUserScore = asyncHandler(async (req, res) => {
  const userScore = await UserScore.findOne({ user: req.user._id });

  if (!userScore) {
    return res.json({ totalPoints: 0, level: 1, badges: [] });
  }

  res.json({
    totalPoints: userScore.totalPoints,
    level: userScore.level,
    badges: userScore.badges,
  });
});





module.exports = { registerUser, authUser, getUserScore };
