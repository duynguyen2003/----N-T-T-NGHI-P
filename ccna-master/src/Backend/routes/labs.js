/**
 * ============================================================
 * FILE: routes/labs.js
 * PURPOSE: Lab/Practical exercise routes
 * TASKS: Task 1.5 (Content Management Service)
 * NOTE: Labs are treated as Lessons with download links (simplified)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/labs/course/:courseId
 * Get labs by course
 */
router.get('/course/:courseId', labController.getLabsByCourse);

/**
 * GET /api/labs/:id
 * Get lab by ID
 */
router.get('/:id', labController.getLabById);

/**
 * POST /api/labs
 * Create lab (admin only)
 * Body: { courseId, title, description, downloadLink }
 */
router.post('/', authenticateToken, requireAdmin, labController.createLab);

/**
 * PUT /api/labs/:id
 * Update lab (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, labController.updateLab);

/**
 * DELETE /api/labs/:id
 * Delete lab (admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, labController.deleteLab);

module.exports = router;
