const express = require('express');
const { generateFlashcards, getAllFlashcards, getFlashcardById, deleteFlashcard } = require('../controllers/flashcardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Generate flashcards from a study note
router.post('/generate', protect, generateFlashcards);

// Get all flashcards for a user
router.get('/', protect, getAllFlashcards);

// Get a single flashcard by ID
router.get('/:id', protect, getFlashcardById);

// Delete a single flashcard by ID
router.delete('/:id', protect, deleteFlashcard);

module.exports = router;
