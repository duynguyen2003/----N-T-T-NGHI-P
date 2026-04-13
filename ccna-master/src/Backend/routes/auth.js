/**
 * ============================================================
 * FILE: routes/auth.js
 * PURPOSE: Authentication routes (register, login, refresh token)
 * TASKS: Task 1.2 (Implement Auth Controller)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register new user
 * Body: { email, password, name }
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 * Body: { refreshToken }
 */
router.post('/refresh', authController.refreshToken);

/**
 * POST /api/auth/logout
 * Logout (invalidate token)
 * Header: { Authorization: 'Bearer TOKEN' }
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * GET /api/auth/me
 * Get current user info
 * Header: { Authorization: 'Bearer TOKEN' }
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
