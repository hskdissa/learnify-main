const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Quiz = require('../models/quizModel');
const StudyNote = require('../models/studyNoteModel');
const UserScore = require("../models/userScoreModel");
const mongoose = require('mongoose'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a quiz from a study note
const generateQuiz = asyncHandler(async (req, res) => {
    const { studyNoteId } = req.body;

    if (!studyNoteId) {
        return res.status(400).json({ message: "Study Note ID is required." });
    }

    const studyNote = await StudyNote.findById(studyNoteId);
    if (!studyNote) {
        return res.status(404).json({ message: "Study Note not found." });
    }

    if (studyNote.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to generate a quiz for this study note." });
    }

    // Prevent duplicate quiz generation
    const existingQuiz = await Quiz.findOne({ studyNote: studyNoteId, user: req.user._id });
    if (existingQuiz) {
        return res.status(400).json({ message: "A quiz for this study note already exists." });
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
                { role: "system", content: "You are an AI that generates multiple-choice quizzes based on study notes. Each quiz should have questions with four options and a correct answer, formatted in JSON." },
                { role: "user", content: prompt },
            ],
        });

        const aiResponse = response?.choices?.[0]?.message?.content.trim();
        if (!aiResponse) {
            return res.status(500).json({ message: "AI did not return a valid response." });
        }

        let quizQuestions;
        try {
            quizQuestions = JSON.parse(aiResponse);
        } catch (error) {
            console.error("Failed to parse AI response:", error.message);
            return res.status(500).json({ message: "Error parsing AI response. Try again." });
        }

        if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
            return res.status(500).json({ message: "Invalid quiz format returned by AI." });
        }

        const quiz = new Quiz({
            title: `Quiz for ${studyNote.title}`,
            questions: quizQuestions,
            user: req.user._id,
            studyNote: studyNote._id,
        });

        await quiz.save();
        res.status(201).json(quiz);

    } catch (error) {
        console.error("Quiz Generation Error:", error.message);
        res.status(500).json({ message: "Error generating quiz." });
    }
});




// Get all quizzes for a specific study note ID
const getQuizzesByStudyNoteId = asyncHandler(async (req, res) => {
    const { studyNoteId } = req.params;
    
    if (!studyNoteId) {
        return res.status(400).json({ message: "Study Note ID is required." });
    }

    // Use `find()` to retrieve all quizzes related to this study note ID
    const quizzes = await Quiz.find({ studyNote: studyNoteId }).sort({ createdAt: -1 });

    if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ message: 'No quizzes found for this study note.' });
    }

    res.status(200).json(quizzes);
});


  
// Get a specific quiz by ID
const getQuizById = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    // Fetch the quiz from the database by quizId
    const quiz = await Quiz.findById(quizId).populate("studyNote", "title");

    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
    }

    // Return the quiz data if found
    res.status(200).json(quiz);
});


// Delete a single quiz by ID
const deleteQuiz = asyncHandler(async (req, res) => {
    // Find the quiz by ID and ensure it belongs to the logged-in user
    const quiz = await Quiz.findOne({ _id: req.params.quizId, user: req.user._id });

    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
    }

    // Delete the quiz
    await quiz.deleteOne();

    // Send a success response
    res.status(200).json({ message: "Quiz deleted successfully." });
});



// Submit quiz and calculate score
const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.user._id;

    if (!quizId || !answers) {
        return res.status(400).json({ message: "Quiz ID and answers are required." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
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

    const totalQuestions = quiz.questions.length;
    const score = correctCount * 5 - incorrectCount * 5; // +5 for correct, -5 for incorrect

    // Determine star rating
    const percentage = (correctCount / totalQuestions) * 100;
    let stars = percentage >= 90 ? 3 : percentage >= 60 ? 2 : 1;

    // Update user score
    let userScore = await UserScore.findOne({ user: userId });
    if (!userScore) {
        userScore = new UserScore({ user: userId, totalPoints: 0, level: 1, badges: [] });
    }

    userScore.totalPoints += score;
    const newLevel = Math.floor(userScore.totalPoints / 50) + 1;

    if (newLevel > userScore.level) {
        userScore.level = newLevel;
    }

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

module.exports = { generateQuiz, deleteQuiz, getQuizzesByStudyNoteId, getQuizById, submitQuiz };

