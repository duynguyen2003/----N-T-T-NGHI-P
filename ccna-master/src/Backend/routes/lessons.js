/**
 * ============================================================
 * FILE: routes/lessons.js
 * PURPOSE: Lesson management routes
 * TASKS: Task 1.5 (Content Management Service)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/lessons/module/:moduleId
 * Get lessons by module
 */
router.get('/module/:moduleId', lessonController.getLessonsByModule);

/**
 * GET /api/lessons/:id
 * Get lesson by ID
 */
router.get('/:id', lessonController.getLessonById);

/**
 * POST /api/lessons
 * Create lesson (admin only)
 * Body: { moduleId, title, content, order }
 */
router.post('/', authenticateToken, requireAdmin, lessonController.createLesson);

/**
 * PUT /api/lessons/:id
 * Update lesson (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, lessonController.updateLesson);

/**
 * DELETE /api/lessons/:id
 * Delete lesson (admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, lessonController.deleteLesson);

module.exports = router;
