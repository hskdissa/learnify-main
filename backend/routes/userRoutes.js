const express = require('express');
const { registerUser, authUser, getUserScore } = require('../controllers/userControllers');

const { protect } = require('../middlewares/authMiddleware');
const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(authUser)

// Get user's score and level
router.get("/score", protect, getUserScore);

module.exports = router;
