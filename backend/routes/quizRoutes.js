const express = require("express");
const { 
  generateQuiz,  
  getQuizzesByStudyNoteId, 
  submitQuiz, 
  deleteQuiz,
  getQuizById
} = require("../controllers/quizController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Generate a quiz from a study note
router.post("/generate", protect, generateQuiz);

// Get the quiz for a specific study note (only one quiz can be generated)
router.get("/studynote/:studyNoteId", protect, getQuizzesByStudyNoteId);

// Get a specific quiz by ID
router.get("/:quizId", protect, getQuizById); // This is the new route


// Submit a quiz and calculate score
router.post("/submit", protect, submitQuiz);

// Delete a quiz by its ID
router.delete("/:quizId", protect, deleteQuiz);

module.exports = router;
