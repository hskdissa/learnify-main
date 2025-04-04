const StudyNote = require('../models/studyNoteModel');
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

// Delete a study note by ID
const deleteStudyNote = async (req, res) => {
  console.log("User ID from Request:", req.user ? req.user._id : "Undefined");

  const { id } = req.params;
  const userId = req.user._id;

  try {
    const studyNote = await StudyNote.findOne({ _id: id, user: userId });

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    await studyNote.deleteOne();

    res.status(200).json({ message: 'Study note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the study note' });
  }
};

module.exports = { getAllStudyNotes, getStudyNoteById, deleteStudyNote };
