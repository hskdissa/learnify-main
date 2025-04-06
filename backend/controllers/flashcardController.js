const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const Flashcard = require('../models/flashcardModel');
const StudyNote = require('../models/studyNoteModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFlashcards = asyncHandler(async (req, res) => {
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
      throw new Error("You are not authorized to generate flashcards for this study note.");
    }

    try {
      const prompt = `
      Generate a set of flashcards from the following study notes.  
      Each flashcard should have a **question** and a **concise answer**.  
      Provide the flashcards in the following JSON format:

      [
        {"question": "What is X?", "answer": "X is..."},
        {"question": "How does Y work?", "answer": "Y works by..."}
      ]

      Use the content of the study notes to form questions that test understanding.  
  
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
            content: "You are an AI that generates educational flashcards based on study notes. Each flashcard should have a question and a concise, accurate answer formatted in JSON."
          },
          { role: "user", content: prompt },
        ],
      });

      const aiResponse = response?.choices?.[0]?.message?.content.trim();
      
      console.log("AI Response:", aiResponse);  // For debugging

      // Attempt to parse AI response as JSON
      let flashcardsArray;
      try {
        flashcardsArray = JSON.parse(aiResponse);
      } catch (error) {
        console.error("Failed to parse AI response as JSON:", error.message);
        return res.status(500).json({ message: "Failed to parse AI response as JSON." });
      }

      if (!Array.isArray(flashcardsArray)) {
        return res.status(500).json({ message: "Invalid flashcard format returned by AI." });
      }

      const flashcardSet = new Flashcard({
        title: `Flashcards for ${studyNote.title}`,
        flashcards: flashcardsArray,
        user: req.user._id,
        studyNote: studyNote._id,
      });

      await flashcardSet.save();
      res.status(200).json(flashcardSet);

    } catch (error) {
      console.error("Flashcard Generation Error:", error.message);
      res.status(500).json({ message: "Error generating flashcards" });
    }
  });



  // Get all flashcards for a user
const getAllFlashcards = asyncHandler(async (req, res) => {
    const flashcards = await Flashcard.find({ user: req.user._id });
  
    if (!flashcards || flashcards.length === 0) {
      return res.status(200).json([]);
    }
  
    res.status(200).json(flashcards);
  });
  
  // Get a single flashcard set by ID
  const getFlashcardById = asyncHandler(async (req, res) => {
    const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard set not found." });
    }
  
    res.status(200).json(flashcard);
  });
  
  // Delete a single flashcard set by ID
  const deleteFlashcard = asyncHandler(async (req, res) => {
    const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard set not found." });
    }
  
    await flashcard.deleteOne();
    res.status(200).json({ message: "Flashcard set deleted successfully." });
  });
  
module.exports = { generateFlashcards, getAllFlashcards, getFlashcardById, deleteFlashcard };
