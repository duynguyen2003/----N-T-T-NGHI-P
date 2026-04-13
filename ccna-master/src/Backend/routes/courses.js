/**
 * ============================================================
 * FILE: routes/courses.js
 * PURPOSE: Course management routes
 * TASKS: Task 1.5 (Content Management Service)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/courses
 * Get all courses (public - no auth needed)
 * Query: page, pageSize
 */
router.get('/', courseController.getAllCourses);

/**
 * GET /api/courses/:id
 * Get course by ID (with modules and lessons)
 */
router.get('/:id', courseController.getCourseById);

/**
 * POST /api/courses
 * Create course (admin only)
 * Body: { title, description, icon, color }
 */
router.post('/', authenticateToken, requireAdmin, courseController.createCourse);

/**
 * PUT /api/courses/:id
 * Update course (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, courseController.updateCourse);

/**
 * DELETE /api/courses/:id
 * Delete course (soft delete, admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, courseController.deleteCourse);

module.exports = router;
