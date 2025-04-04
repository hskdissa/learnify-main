// config/openaiPrompts.js

const studyNotesPrompt = `
Please generate structured study notes based on the following text. Use headings, sub-headings, and bullet points for key ideas and concepts. Each bullet point should be a brief explanation of the concept or key term. Bold important terms or concepts and make the structure easy to follow for beginners.

Extracted Text:
{{extractedText}}
`;

module.exports = {
  studyNotesPrompt,
};
