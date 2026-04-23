const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);

// GET Exams for both Admin and Student
router.get('/', examController.getExams);

// Admin Restrictions for modifications
router.use(checkRole(['ADMIN']));
router.get('/detail/:id', examController.getExamById);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

module.exports = router;
