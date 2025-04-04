import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getStudyNoteById, deleteStudyNote } from '../controllers/studyNoteController.js';

const router = express.Router();

router.route('/:id').get(protect, getStudyNoteById);
router.route('/:id').delete(protect, deleteStudyNote);

export default router;
