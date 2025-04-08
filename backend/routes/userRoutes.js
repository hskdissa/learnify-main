const express = require('express');
const { registerUser, authUser, changeProfile } = require('../controllers/userControllers');
const { getUserTotalPoints } = require("../controllers/quizController"); 

const { protect } = require('../middlewares/authMiddleware');
const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(authUser)

router.post("/my-profile", protect, changeProfile);

// Get user's score and level
//router.get("/score", protect, getUserScore);

// Add the route for fetching user total points and level
router.get("/total-points", protect, getUserTotalPoints);

module.exports = router;
