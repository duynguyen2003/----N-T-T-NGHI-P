/**
 * ============================================================
 * FILE: routes/users.js
 * PURPOSE: User management routes
 * TASKS: Task 1.4 (User Management Service)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/users
 * Get all users (admin only)
 * Query: page, pageSize
 */
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

/**
 * GET /api/users/:id
 * Get user by ID (can be self, or admin can view others)
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * PUT /api/users/:id
 * Update user (can update self, or admin can update others)
 */
router.put('/:id', authenticateToken, userController.updateUser);

/**
 * DELETE /api/users/:id
 * Delete user (soft delete, admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router;
