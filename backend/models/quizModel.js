const mongoose = require('mongoose');

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: {
          type: [String],
          required: true,
          validate: [(val) => val.length >= 2, 'At least two options are required.'],
        },
        correctAnswer: {
          type: String,
          required: true,
          validate: {
            validator: function (answer) {
              return this.options.includes(answer);
            },
            message: 'Correct answer must be one of the provided options.',
          },
        },
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
      required: true, 
    },
    
    score: {
      type: Number,
      default: 0,
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

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
