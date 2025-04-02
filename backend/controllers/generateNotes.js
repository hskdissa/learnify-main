const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/uploadfile', protect, upload.single('file'), uploadFile);

module.exports = router;
