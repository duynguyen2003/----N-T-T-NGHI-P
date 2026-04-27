const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(verifyToken);

// GET Exams for both Admin and Student
router.get('/', examController.getExams);
router.get('/detail/:id', examController.getExamById);

// Admin Restrictions for modifications
router.use(checkRole(['ADMIN']));
router.post('/question-image', upload.single('image'), examController.uploadQuestionImage);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

module.exports = router;
