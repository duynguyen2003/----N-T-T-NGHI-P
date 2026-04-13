/**
 * ============================================================
 * FILE: controllers/authController.js
 * PURPOSE: Handle authentication logic (register, login, etc.)
 * TASKS: Task 1.2 - Implement Auth Controller
 * STATUS: Stub - to be implemented
 * ============================================================
 */

const { getPrisma } = require('../config/database');
const authService = require('../services/authService');
const { createdResponse, successResponse } = require('../utils/response');

/**
 * POST /api/auth/register
 * Register new user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} next - Express next middleware
 */
const register = async (req, res, next) => {
  try {
    // TODO: Implement registration logic
    // 1. Validate input (email format, password strength)
    // 2. Check if user already exists
    // 3. Hash password
    // 4. Create user in database
    // 5. Generate tokens
    // 6. Return user + tokens
    
    res.status(201).json({
      success: false,
      message: 'Not implemented yet - Task 1.2'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} next - Express next middleware
 */
const login = async (req, res, next) => {
  try {
    // TODO: Implement login logic
    // 1. Validate email and password
    // 2. Find user by email
    // 3. Verify password
    // 4. Generate tokens
    // 5. Save refresh token to database
    // 6. Return user + tokens

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.2'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} next - Express next middleware
 */
const refreshToken = async (req, res, next) => {
  try {
    // TODO: Implement refresh token logic
    // 1. Get refresh token from request body
    // 2. Verify refresh token
    // 3. Check if refresh token exists in database
    // 4. Generate new access token
    // 5. Return new access token

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.2'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token)
 */
const logout = async (req, res, next) => {
  try {
    // TODO: Implement logout logic
    // 1. Get user ID from req.user
    // 2. Delete refresh token from database
    // 3. Return success message

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.2'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // TODO: Implement get current user logic
    // 1. Get user ID from req.user
    // 2. Fetch user from database (exclude password)
    // 3. Return user info

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.2'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser
};
