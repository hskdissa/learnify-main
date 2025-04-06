const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    flashcards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studyNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyNote',
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

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
