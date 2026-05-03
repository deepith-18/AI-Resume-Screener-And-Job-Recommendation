const express = require('express');
const router = express.Router();

const {
  uploadResume,
  analyzeResumeById,
  getResume,
  listResumes,
  deleteResumeById,
} = require('../controllers/resumeController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ ROUTES
router.get('/', listResumes);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/:resumeId', getResume);
router.post('/analyze/:resumeId', analyzeResumeById);
router.delete('/:resumeId', deleteResumeById);

module.exports = router;