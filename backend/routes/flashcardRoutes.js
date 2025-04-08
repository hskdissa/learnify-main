const express = require('express');
const { generateFlashcards, 
        getAllFlashcards, 
        getFlashcardById, 
        deleteFlashcard, 
        getFlashcardsByStudyNoteId,
        getSingleFlashcard} = require('../controllers/flashcardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Generate flashcards from a study note
router.post('/generate', protect, generateFlashcards);

// Get all flashcards for a user
router.get('/', protect, getAllFlashcards);

router.get('/:id', protect, getSingleFlashcard);

// Get flashcards related to a specific study note ID (THIS IS THE IMPORTANT ROUTE)
router.get('/studynote/:studyNoteId', protect, getFlashcardsByStudyNoteId);


// Get a single flashcard by ID within the context of a study note
router.get('/studynote/:studyNoteId/flashcards/:flashcardId', protect, getFlashcardById);



// Delete a single flashcard by ID
router.delete('/:id', protect, deleteFlashcard);


module.exports = router;
