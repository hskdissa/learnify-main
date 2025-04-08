const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const UserScore = require("../models/userScoreModel");
const generateToken = require('../utils/generateToken');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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



const changeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    //Save information
    const updatedUser = await user.save();

    // Send information to the frontend
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email, 
      token: generateToken(updatedUser._id),
    })

  }
  else{
    res.status(404)
    throw new Error('User Not Found')
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





module.exports = { registerUser, authUser, changeProfile, getUserScore };
