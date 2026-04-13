/**
 * ============================================================
 * FILE: routes/admin.js
 * PURPOSE: Admin panel routes
 * TASKS: Task 1.3 (Admin Dashboard Backend)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics (4 cards: totalUsers, totalCourses, totalExams, activeSessions)
 */
router.get('/dashboard', authenticateToken, requireAdmin, adminController.getDashboard);

/**
 * GET /api/admin/logs
 * Get admin activity logs (from AdminLog table)
 * Query: page, pageSize
 * Note: Database only, UI not required for MVP
 */
router.get('/logs', authenticateToken, requireAdmin, adminController.getAdminLogs);

module.exports = router;
