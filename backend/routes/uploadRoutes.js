const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

const router = express.Router();

// Define the route directly as /api/uploadfile
router.post("/uploadfile", protect, upload.single("file"), uploadFile);

module.exports = router;
