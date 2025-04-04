const express = require("express");
const { 
    getStudyNoteById, 
    deleteStudyNote, 
    getAllStudyNotes 
} = require("../controllers/studyNoteController");  

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all study notes for logged-in user
router.get("/", protect, getAllStudyNotes);

// Get a single study note by ID
router.get("/:id", protect, getStudyNoteById);

// Delete a study note by ID
router.delete("/:id", protect, deleteStudyNote);

module.exports = router;
