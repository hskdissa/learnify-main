const express = require("express");
const { generateNotes } = require("../controllers/generateNotes");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generateNotes", protect, generateNotes);

module.exports = router;
