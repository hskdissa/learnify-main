const mongoose = require('mongoose');

const studyNoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    aiResponse: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  // The user who generated the note
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StudyNote = mongoose.model('StudyNote', studyNoteSchema);

module.exports = StudyNote;
