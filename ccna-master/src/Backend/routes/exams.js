/**
 * ============================================================
 * FILE: routes/exams.js
 * PURPOSE: Exam/Quiz management routes
 * TASKS: Task 1.6 (Exam Management Service)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/exams
 * Get all exams (public - no auth needed)
 */
router.get('/', examController.getAllExams);

/**
 * GET /api/exams/:id
 * Get exam by ID (with questions)
 */
router.get('/:id', examController.getExamById);

/**
 * POST /api/exams
 * Create exam (admin only)
 * Body: { courseId, title, description, timeLimit }
 */
router.post('/', authenticateToken, requireAdmin, examController.createExam);

/**
 * PUT /api/exams/:id
 * Update exam (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, examController.updateExam);

/**
 * DELETE /api/exams/:id
 * Delete exam (admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, examController.deleteExam);

/**
 * POST /api/exams/:id/submit
 * Submit exam answers (student)
 */
router.post('/:id/submit', authenticateToken, examController.submitExam);

module.exports = router;
