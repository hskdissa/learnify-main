const StudyNote = require('../models/studyNoteModel');
const Flashcard = require("../models/flashcardModel");
const Quiz = require('../models/quizModel');  // Ensure Quiz model is imported
const asyncHandler = require("express-async-handler");


const getAllStudyNotes = asyncHandler(async (req, res) => {
  console.log("User ID from Request:", req.user._id);  // Debugging line
  
  const studyNotes = await StudyNote.find({ user: req.user._id });

  if (!studyNotes || studyNotes.length === 0) {
    console.log("No Study Notes Found for User:", req.user._id);
    return res.status(200).json([]);  // Changed from 404 to 200 with an empty array
  }


  console.log("Retrieved Study Notes:", studyNotes);
  res.status(200).json(studyNotes);
});


// Get a specific study note by ID
const getStudyNoteById = async (req, res) => {
  console.log("User ID from Request:", req.user ? req.user._id : "Undefined");

  const { id } = req.params;
  const userId = req.user._id;

  try {
    const studyNote = await StudyNote.findOne({ _id: id, user: userId });

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    res.status(200).json(studyNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the study note' });
  }
};



/*
// Delete a study note along with related flashcards
const deleteStudyNote = async (req, res) => {
  console.log("User ID from Request:", req.user ? req.user._id : "Undefined");

  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Find the study note
    const studyNote = await StudyNote.findOne({ _id: id, user: userId });

    if (!studyNote) {
      return res.status(404).json({ message: "Study note not found" });
    }

    console.log("Study note found, ID:", id);

    // Find flashcards related to the study note
    const relatedFlashcards = await Flashcard.find({ studyNote: id });

    console.log("Related flashcards found:", relatedFlashcards.length);

    // Delete all flashcards related to this study note
    await Flashcard.deleteMany({ studyNote: id });

    console.log("Flashcards deleted successfully.");

    // Delete the study note
    await studyNote.deleteOne();

    res.status(200).json({ message: "Study note and related flashcards deleted successfully" });
  } catch (error) {
    console.error("Error deleting study note and flashcards:", error);
    res.status(500).json({ message: "An error occurred while deleting the study note and flashcards" });
  }
};
*/

// Delete a study note along with related flashcards and quizzes
const deleteStudyNote = asyncHandler(async (req, res) => {
  console.log("User ID from Request:", req.user ? req.user._id : "Undefined");

  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Find the study note
    const studyNote = await StudyNote.findOne({ _id: id, user: userId });

    if (!studyNote) {
      return res.status(404).json({ message: "Study note not found" });
    }

    console.log("Study note found, ID:", id);

    // Find flashcards related to the study note
    const relatedFlashcards = await Flashcard.find({ studyNote: id });

    console.log("Related flashcards found:", relatedFlashcards.length);

    // Delete all flashcards related to this study note
    await Flashcard.deleteMany({ studyNote: id });

    console.log("Flashcards deleted successfully.");

    // Find quizzes related to the study note
    const relatedQuizzes = await Quiz.find({ studyNote: id });

    console.log("Related quizzes found:", relatedQuizzes.length);

    // Delete all quizzes related to this study note
    await Quiz.deleteMany({ studyNote: id });

    console.log("Quizzes deleted successfully.");

    // Delete the study note
    await studyNote.deleteOne();

    res.status(200).json({ message: "Study note and related flashcards and quizzes deleted successfully" });
  } catch (error) {
    console.error("Error deleting study note, flashcards, and quizzes:", error);
    res.status(500).json({ message: "An error occurred while deleting the study note, flashcards, and quizzes" });
  }
});


module.exports = { getAllStudyNotes, getStudyNoteById, deleteStudyNote };
