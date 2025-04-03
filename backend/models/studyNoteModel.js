const mongoose = require('mongoose');

const studyNoteSchema = mongoose.Schema(
  {
    aiResponse: {
      type: String,
      required: true,  // The AI-generated response
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  // The user who generated the note
    },
    createdAt: {
      type: Date,
      default: Date.now,  // Timestamp for when the note was created
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt fields
  }
);

const StudyNote = mongoose.model('StudyNote', studyNoteSchema);

module.exports = StudyNote;
