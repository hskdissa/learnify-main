// In your uploadRoutes.js or routes file

const express = require('express');
const { generateNotesFromText } = require('../controllers/aiController'); // Import the function from aiController
const router = express.Router();

router.post('/generateNotes', async (req, res) => {
  try {
    const { extractedText } = req.body;
    
    // Generate notes from the extracted text
    const generatedNotes = await generateNotesFromText(extractedText);

    // Respond with the generated notes
    res.json({ generatedNotes });
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ message: 'Error generating notes from AI' });
  }
});

module.exports = router;
