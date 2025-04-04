const express = require("express");
const { generateAIResponse } = require("../controllers/openaiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// AI generation route
router.post("/generate", protect, generateAIResponse);



module.exports = router;
