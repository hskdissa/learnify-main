const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const StudyNote = require('../models/studyNoteModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAIResponse = asyncHandler(async (req, res) => {
  console.log("Received request body:", req.body);
  const { extractedText, title } = req.body;

  if (!extractedText || !title) {
    res.status(400);
    throw new Error("Title and text are required for AI processing");
    //throw new Error("No text provided for AI processing");
  }

  
  try {

    const prompt = `
    Please generate **structured study notes** based on the following text.  
    Follow these formatting rules:  
    1. **Main Topic:** Start with a clear main heading summarizing the key subject.  
    2. **Subtopics:** Break the content into logical subheadings for different concepts.  
    3. **Bullet Points:** Use concise bullet points to summarize key ideas, definitions, and examples.  
    4. **Bold Key Terms:** Highlight essential terms and concepts in **bold**.  
    5. **Clear and Concise:** Ensure the notes are structured for easy understanding and quick revision.  

    **Extracted Text:**  
    ${extractedText}  

    **Expected Output Example:**  
    - **[Main Topic]**  
      - **[Subtopic]**  
        - Explanation in bullet points  
      - **[Another Subtopic]**  
        - Explanation in bullet points  

    Ensure clarity, logical structure, and well-formatted notes to make studying easier.
    `;

    console.log("Prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.2, 
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are an AI that generates detailed, structured study notes with headings, sub-headings, and bullet points based on the provided text. Each sub-heading should be followed by bullet points that explain key ideas, terms, and examples. Bold the most important terms and concepts."
        },
        { role: "user", content: prompt }
      ],
    });


    
    console.log("OpenAI Response:", response);

    if (response && response.choices && response.choices.length > 0) {
      const aiResponse = response.choices[0].message.content;
      console.log("AI Response:", aiResponse);


      const studyNote = new StudyNote({
<<<<<<< HEAD
        title,
=======
>>>>>>> b8403af1f1460d0b38610295cb73550e836366c9
        aiResponse,
        user: req.user._id,
        createdAt: Date.now(),
      });

      await studyNote.save();

      console.log("StudyNote saved:", studyNote);

      res.status(200).json({ aiResponse, studyNote });
    } else {
      res.status(500).json({ message: "Invalid response from OpenAI" });
    }
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "Error generating AI response" });
  }
});

module.exports = { generateAIResponse };
