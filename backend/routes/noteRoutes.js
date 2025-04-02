const express = require('express');
const { getNotes, createNote, getNoteById, updateNote, deleteNote } = require('../controllers/noteControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// get request: to get al the routes from the backend
router.route('/').get( protect, getNotes );

// post request: to create a new route
router.route('/create').post(protect, createNote);

// put request: to update a route
router.route('/:id').get(protect, getNoteById).put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
