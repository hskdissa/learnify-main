const asyncHandler = require("express-async-handler");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

const generateAIResponse = asyncHandler(async (req, res) => {
    console.log("Received request body:", req.body);
  
    const { extractedText } = req.body;
  
    if (!extractedText) {
      res.status(400);
      throw new Error("No text provided for AI processing");
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // model chosen
        messages: [
          { role: "system", content: "Summarize the following text:" },
          { role: "user", content: extractedText },
        ],
      });
  
      console.log("OpenAI API Response:", response); // Log the full response to the server's console
  
      if (response && response.choices && response.choices[0]) {
        const aiResponse = response.choices[0].message.content;
        console.log("AI Response:", aiResponse);
        res.status(200).json({ aiResponse }); // Send the AI response to the frontend
      } else {
        res.status(500).json({ message: "Invalid response from OpenAI" });
      }
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ message: "Error generating AI response" });
    }
  });
  

module.exports = { generateAIResponse };
