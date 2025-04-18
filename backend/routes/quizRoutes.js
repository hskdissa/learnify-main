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

// Get the quiz for a specific study note
router.get("/studynote/:studyNoteId", protect, getQuizzesByStudyNoteId);


// Get the quiz for a specific study note along with the Quiz ID
router.get("/studynote/:studyNoteId/quiz/:quizId", protect, getQuizById);


// Submit a quiz and calculate score
router.post("/studynote/:studyNoteId/quiz/:quizId/submit", protect, submitQuiz);


// Delete a quiz by its ID
router.delete("/:quizId", protect, deleteQuiz);

module.exports = router;
