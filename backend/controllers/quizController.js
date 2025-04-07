const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Quiz = require('../models/quizModel');
const StudyNote = require('../models/studyNoteModel');
const UserScore = require("../models/userScoreModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



/*
// Generate a quiz from a study note
const generateQuiz = asyncHandler(async (req, res) => {
    const { studyNoteId } = req.body;

    if (!studyNoteId) {
      res.status(400);
      throw new Error("Study Note ID is required.");
    }

    const studyNote = await StudyNote.findById(studyNoteId);

    if (!studyNote) {
      res.status(404);
      throw new Error("Study Note not found.");
    }

    // Ensure the authenticated user owns the study note
    if (studyNote.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to generate a quiz for this study note.");
    }

    try {
      const prompt = `
      Generate a multiple-choice quiz from the following study notes.  
      Each question should have four options, with one correct answer.  
      Provide the quiz in the following JSON format:

      [
        {
          "question": "What is X?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]

      Use the content of the study notes to form meaningful questions.  
  
      **Study Notes:**  
      ${studyNote.aiResponse}  
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0.3,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: "You are an AI that generates multiple-choice quizzes based on study notes. Each quiz should have questions with four options and a correct answer, formatted in JSON."
          },
          { role: "user", content: prompt },
        ],
      });

      const aiResponse = response?.choices?.[0]?.message?.content.trim();
      
      console.log("AI Response:", aiResponse);  // Debugging

      // Parse AI response as JSON
      let quizQuestions;
      try {
        quizQuestions = JSON.parse(aiResponse);
      } catch (error) {
        console.error("Failed to parse AI response as JSON:", error.message);
        return res.status(500).json({ message: "Failed to parse AI response as JSON." });
      }

      if (!Array.isArray(quizQuestions)) {
        return res.status(500).json({ message: "Invalid quiz format returned by AI." });
      }

      const quiz = new Quiz({
        title: `Quiz for ${studyNote.title}`,
        questions: quizQuestions,
        user: req.user._id,
        studyNote: studyNote._id,
      });

      await quiz.save();
      res.status(200).json(quiz);

    } catch (error) {
      console.error("Quiz Generation Error:", error.message);
      res.status(500).json({ message: "Error generating quiz" });
    }
});

*/

// Generate a quiz from a study note
const generateQuiz = asyncHandler(async (req, res) => {
    const { studyNoteId } = req.body;

    if (!studyNoteId) {
        res.status(400);
        throw new Error("Study Note ID is required.");
    }

    const studyNote = await StudyNote.findById(studyNoteId);

    if (!studyNote) {
        res.status(404);
        throw new Error("Study Note not found.");
    }

    // Ensure the authenticated user owns the study note
    if (studyNote.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to generate a quiz for this study note.");
    }

    // Check if a quiz already exists for the study note
    const existingQuiz = await Quiz.findOne({ studyNote: studyNoteId, user: req.user._id });

    if (existingQuiz) {
        return res.status(400).json({ message: "You have already generated a quiz for this study note." });
    }

    try {
        const prompt = `
        Generate a multiple-choice quiz from the following study notes.  
        Each question should have four options, with one correct answer.  
        Provide the quiz in the following JSON format:

        [
          {
            "question": "What is X?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A"
          }
        ]

        Use the content of the study notes to form meaningful questions.  

        **Study Notes:**  
        ${studyNote.aiResponse}  
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            temperature: 0.3,
            max_tokens: 1500,
            messages: [
                {
                    role: "system",
                    content: "You are an AI that generates multiple-choice quizzes based on study notes. Each quiz should have questions with four options and a correct answer, formatted in JSON."
                },
                { role: "user", content: prompt },
            ],
        });

        const aiResponse = response?.choices?.[0]?.message?.content.trim();

        // Parse AI response as JSON
        let quizQuestions;
        try {
            quizQuestions = JSON.parse(aiResponse);
        } catch (error) {
            console.error("Failed to parse AI response as JSON:", error.message);
            return res.status(500).json({ message: "Failed to parse AI response as JSON." });
        }

        if (!Array.isArray(quizQuestions)) {
            return res.status(500).json({ message: "Invalid quiz format returned by AI." });
        }

        const quiz = new Quiz({
            title: `Quiz for ${studyNote.title}`,
            questions: quizQuestions,
            user: req.user._id,
            studyNote: studyNote._id,
        });

        await quiz.save();
        res.status(200).json(quiz);

    } catch (error) {
        console.error("Quiz Generation Error:", error.message);
        res.status(500).json({ message: "Error generating quiz" });
    }
});



// Get all quizzes for a user
const getAllQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ user: req.user._id });
  
    if (!quizzes || quizzes.length === 0) {
      return res.status(200).json([]);
    }
  
    res.status(200).json(quizzes);
});



// Delete a quiz by ID
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
  
    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully." });
});

// Get all quizzes for a specific study note ID
const getQuizzesByStudyNoteId = asyncHandler(async (req, res) => {
  const { studyNoteId } = req.params;

  if (!studyNoteId) {
    res.status(400);
    throw new Error("Study Note ID is required.");
  }

  const quizzes = await Quiz.find({ studyNote: studyNoteId, user: req.user._id });

  if (!quizzes || quizzes.length === 0) {
    return res.status(404).json({ message: "No quizzes found for this study note." });
  }

  res.status(200).json(quizzes);
});



// Calculate quiz score and update user progress
const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.user._id;
  
    if (!quizId || !answers) {
      res.status(400);
      throw new Error("Quiz ID and answers are required.");
    }
  
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404);
      throw new Error("Quiz not found.");
    }
  
    let correctCount = 0;
    let incorrectCount = 0;
  
    // Evaluate answers
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
  
    // Scoring system
    const totalQuestions = quiz.questions.length;
    const score = correctCount * 5 - incorrectCount * 5; // +5 for correct, -5 for incorrect
  
    // Determine star rating
    const percentage = (correctCount / totalQuestions) * 100;
    let stars = 1;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 60) stars = 2;
  
    // Update user score
    let userScore = await UserScore.findOne({ user: userId });
    if (!userScore) {
      userScore = new UserScore({ user: userId });
    }
    userScore.totalPoints += score;
  
    // Leveling up
    const newLevel = Math.floor(userScore.totalPoints / 50) + 1;
    if (newLevel > userScore.level) {
      userScore.level = newLevel;
    }
  
    // Award badges at level 10, 20, 30, etc.
    if (newLevel % 10 === 0 && !userScore.badges.includes(`Level ${newLevel} Badge`)) {
      userScore.badges.push(`Level ${newLevel} Badge`);
    }
  
    await userScore.save();
  
    res.json({
      message: "Quiz submitted successfully",
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      totalQuestions,
      score,
      stars,
      totalPoints: userScore.totalPoints,
      level: userScore.level,
      badges: userScore.badges,
    });
  });

module.exports = { generateQuiz, getAllQuizzes, deleteQuiz, getQuizzesByStudyNoteId, submitQuiz };
