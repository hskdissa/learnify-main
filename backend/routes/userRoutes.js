const express = require('express');
const { registerUser, authUser, changeProfile } = require('../controllers/userControllers');
const { getUserTotalPoints } = require("../controllers/quizController"); 

const { protect } = require('../middlewares/authMiddleware');
const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(authUser)

router.post("/my-profile", protect, changeProfile);

// Add the route for fetching user total points and level
router.get("/total-points", protect, getUserTotalPoints);

// Forgot password (send email with reset link)
//router.route('/forgot-password').post(forgotPassword);

// Reset password (with token)
//router.route('/reset-password/:token').post(resetPassword);

module.exports = router;
