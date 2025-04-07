// models/scoreModel.js (or wherever your QuizScore schema is defined)
const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studyNote: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyNote', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  points: { type: Number, required: true },
}, { timestamps: true });

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

module.exports = QuizScore;
