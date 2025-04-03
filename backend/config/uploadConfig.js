// backend/config/uploadConfig.js
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory to store uploaded files
    cb(null, 'backend/uploads'); // files will be stored in 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Generate a unique file name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer instance with limits and storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: limit file size (e.g., 10MB)
});

module.exports = upload;
