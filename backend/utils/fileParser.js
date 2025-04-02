// backend/utils/fileParser.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); // Install pdf-parse if needed
const docxParser = require('mammoth'); // Install mammoth if needed

// Function to parse the file based on its type (e.g., PDF or DOCX)
const parseFile = (file) => {
  const filePath = path.join(__dirname, '../uploads', file.filename); // File path

  return new Promise((resolve, reject) => {
    const extname = path.extname(file.originalname).toLowerCase();
    
    // Handle PDF files
    if (extname === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      pdfParse(dataBuffer)
        .then(function (data) {
          resolve(data.text); // Return extracted text from PDF
        })
        .catch(reject);
    }
    // Handle DOCX files
    else if (extname === '.docx') {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err);

        docxParser.extractRawText({ buffer: data })
          .then((result) => {
            resolve(result.value); // Return extracted text from DOCX
          })
          .catch(reject);
      });
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

module.exports = { parseFile };
