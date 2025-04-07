const express = require('express');
const { 
  generateQuiz, 
  getAllQuizzes, 
  getQuizzesByStudyNoteId, 
  submitQuiz, 
  deleteQuiz 
} = require('../controllers/quizController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Generate a quiz from a study note
router.post('/generate', protect, generateQuiz);

// Get all quizzes for a user
router.get('/', protect, getAllQuizzes);

// Get quizzes related to a specific study note ID
router.get('/studynote/:studyNoteId', protect, getQuizzesByStudyNoteId);


// Submit quiz and calculate score
router.post("/submit", protect, submitQuiz);

// Delete a quiz by ID
router.delete('/:id', protect, deleteQuiz);

module.exports = router;
