/**
 * ============================================================
 * FILE: routes/modules.js
 * PURPOSE: Module management routes
 * TASKS: Task 1.5 (Content Management Service)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/modules/course/:courseId
 * Get modules by course
 */
router.get('/course/:courseId', moduleController.getModulesByCourse);

/**
 * GET /api/modules/:id
 * Get module by ID
 */
router.get('/:id', moduleController.getModuleById);

/**
 * POST /api/modules
 * Create module (admin only)
 * Body: { courseId, title, order }
 */
router.post('/', authenticateToken, requireAdmin, moduleController.createModule);

/**
 * PUT /api/modules/:id
 * Update module (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, moduleController.updateModule);

/**
 * DELETE /api/modules/:id
 * Delete module (admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, moduleController.deleteModule);

module.exports = router;
