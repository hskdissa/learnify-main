const express = require("express");
const { generateAIResponse } = require("../controllers/openaiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateAIResponse);

router.get("/test", (req, res) => {
    res.json({ message: "OpenAI route is working!" });
  });
  

module.exports = router;
