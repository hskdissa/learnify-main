const StudyNote = require('../models/studyNoteModel');

// Get a specific study note by ID
const getStudyNoteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const studyNote = await StudyNote.findOne({ _id: id, user: userId }); // Ensure note belongs to the logged-in user

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    res.status(200).json(studyNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a study note by ID
const deleteStudyNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const studyNote = await StudyNote.findOne({ _id: id, user: userId });

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    await studyNote.remove();
    res.status(200).json({ message: 'Study note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudyNoteById, deleteStudyNote };
