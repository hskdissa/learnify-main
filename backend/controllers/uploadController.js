const asyncHandler = require('express-async-handler');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');  // For DOCX files
const fs = require('fs-extra');      // Handle file operations

const uploadFile = asyncHandler(async (req, res) => {
    console.log("Inside uploadFile controller");

    if (!req.user) {
        console.error("req.user is NULL in uploadFile");
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("User ID:", req.user._id);
    console.log("Uploaded File:", req.file.originalname);

    const filePath = req.file.path; // Get uploaded file path
    const fileExtension = req.file.mimetype;

    try {
        let extractedText = "";

        if (fileExtension === "application/pdf") {
            // Parse PDF file
            const data = await pdfParse(fs.readFileSync(filePath));
            extractedText = data.text;
        } else if (fileExtension === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // Parse DOCX file
            const data = await mammoth.extractRawText({ path: filePath });
            extractedText = data.value;
        } else {
            console.log("Unsupported file type:", fileExtension);
            return res.status(400).json({ message: "Unsupported file type" });
        }

        console.log("Extracted Text:", extractedText.slice(0, 500)); // Log first 500 chars

        // Delete uploaded file after extraction
        fs.unlinkSync(filePath);

        res.status(201).json({
            message: "File uploaded and processed successfully",
            extractedText,
        });

    } catch (error) {
        console.error("Error extracting text:", error);
        res.status(500).json({ message: "Error processing file" });
    }
});

module.exports = { uploadFile };
