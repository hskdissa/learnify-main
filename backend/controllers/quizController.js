const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Quiz = require('../models/quizModel');
const StudyNote = require('../models/studyNoteModel');
const UserScore = require("../models/userScoreModel");
const QuizScore = require('../models/scoreModel');
const mongoose = require('mongoose'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a quiz from a study note
const generateQuiz = asyncHandler(async (req, res) => {
    // Check for the study note id in the request body
    const { studyNoteId } = req.body;
    
    // Error handling for missing study note id
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

    // To retrieve the quiz related to this study note ID
    const quizzes = await Quiz.find({ studyNote: studyNoteId }).sort({ createdAt: -1 });

    if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ message: 'No quizzes found for this study note.' });
    }

    res.status(200).json(quizzes);
});




const getQuizById = async (req, res) => {
  const { studyNoteId, quizId } = req.params;

  // Check if the studyNoteId and quizId are valid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(studyNoteId) || !mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ message: "Invalid studyNoteId or quizId" });
  }

  try {
    // Fetch the quiz by quizId and ensure it belongs to the studyNoteId
    const quiz = await Quiz.findOne({ _id: quizId, studyNote: studyNoteId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found or doesn't belong to this study note." });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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






const submitQuiz = async (req, res) => {
    try {
      const { studyNoteId, quizId } = req.params;
      // Answers submitted by the user
      const { answers } = req.body; 
  
      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      // Calculate score and points
      let score = 0;
      let points = 0; 
      let questionsWithUserAnswers = [];
  
      quiz.questions.forEach((question) => {
        const userAnswer = answers[question._id];
        const correctAnswer = question.correctAnswer;
  
        if (userAnswer === correctAnswer) {
          score += 1;
          points += 5;
        }
  
        // Save the question, user answer, and correct answer for feedback
        questionsWithUserAnswers.push({
          question: question.question,
          options: question.options,
          correctAnswer,
          userAnswer,
        });
      });
  
      console.log("Received user answers:", answers);
  
      // Prepare AI prompt with user answers
      const aiPrompt = `
      You are an AI that evaluates quiz responses. Compare the user's answer to the correct answer and always provide feedback.
      
      If the user's answer is correct, respond with "Correct" in the explanation.
      If the user's answer is incorrect, explain why it is wrong and provide the correct explanation.
      
      Provide the response in JSON format only.
      
      Format:
      [
        {
          "question": "What is X?",
          "userAnswer": "Option B",
          "correctAnswer": "Option A",
          "explanation": "Incorrect. The correct answer is A because..."
        }
      ]
      
      User's Quiz Responses:
      ${JSON.stringify(questionsWithUserAnswers)}
      `;
      
      
  
      // Send to AI for feedback
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0.3,
        max_tokens: 1500,
        messages: [
          { role: "system", content: "You evaluate quiz results and provide explanations for incorrect answers." },
          { role: "user", content: aiPrompt },
        ],
      });
  
      // Parse AI response and handle any potential errors
      let feedback = [];
      try {
        const aiContent = aiResponse?.choices?.[0]?.message?.content;
        if (!aiContent) {
          throw new Error('AI response content is missing');
        }
        console.log("Raw AI Content:", aiContent); // Debugging
        feedback = JSON.parse(aiContent);
      } catch (error) {
        console.error("AI response parsing failed:", error.message);
        return res.status(500).json({ message: "Failed to parse AI response", error: error.message });
      }
  
      // Begin a transaction to ensure quiz score and user score updates
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // Save the user's score for this study note and quiz
        const userId = req.user._id;
        const quizScore = new QuizScore({
          user: userId,
          studyNote: studyNoteId,
          quiz: quizId,
          score: score,
          points: points,
        });
  
        await quizScore.save({ session });


  
        // Update user score in database
        let userScore = await UserScore.findOne({ user: userId }).session(session);

        if (!userScore) {
          userScore = new UserScore({
            user: userId,
            totalPoints: points,
            level: 1,
          });
        } else {
          // Add new points
          userScore.totalPoints += points; 
          // Level up every 50 points
          userScore.level = Math.floor(userScore.totalPoints / 50) + 1; 
        }

        await userScore.save({ session });


  


        // Commit transaction
        await session.commitTransaction();
        session.endSession();
  
        // Return result
        res.status(200).json({
          message: "Quiz submitted successfully",
          score: `${score}/${questionsWithUserAnswers.length}`,
          points: points, 
          feedback,
        });
  
      } catch (transactionError) {
        // In case of any error, abort the transaction
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", transactionError);
        return res.status(500).json({ message: "Failed to save quiz score or user score", error: transactionError.message });
      }
  
    } catch (error) {
      console.error("General server error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  



const getUserTotalPoints = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const userScore = await UserScore.findOne({ user: userId });

        if (!userScore) {
            return res.status(200).json({ totalPoints: 0, level: 0 }); 
        }

        res.status(200).json({ 
            totalPoints: userScore.totalPoints,
            level: userScore.level
        });
    } catch (error) {
        console.error("Error fetching total points:", error);
        res.status(500).json({ message: "Error retrieving total points" });
    }
});



module.exports = { generateQuiz, deleteQuiz, getQuizzesByStudyNoteId, getQuizById, submitQuiz, getUserTotalPoints };

