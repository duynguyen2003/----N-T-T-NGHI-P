/**
 * ============================================================
 * FILE: services/authService.js
 * PURPOSE: Business logic for authentication
 * TASKS: Task 1.2 - Implement Auth Controller
 * SIMPLIFIED: Using 2 roles (STUDENT, ADMIN)
 * STATUS: Stub - to be implemented
 * ============================================================
 */

const { getPrisma } = require('../config/database');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } = require('../utils/helpers');
const { ValidationError, ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors');
const { validateEmail, validatePassword } = require('../middleware/validation');
const { ROLES } = require('../config/constants');

/**
 * Register new user (auto role: STUDENT)
 * @param {Object} data - { email, password, name }
 * @returns {Promise<Object>} Created user + tokens
 */
const registerUser = async (data) => {
  try {
    // TODO: Task 1.2
    // 1. Validate inputs
    // 2. Check if user exists
    // 3. Hash password
    // 4. Create user with role = STUDENT (default)
    // 5. Generate tokens
    // 6. Save refresh token
    // 7. Return user + tokens
    
    throw new Error('Not implemented - Task 1.2');
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} User + tokens
 */
const loginUser = async (data) => {
  try {
    // TODO: Task 1.2
    // 1. Validate inputs
    // 2. Find user by email
    // 3. Verify password
    // 4. Generate tokens
    // 5. Save refresh token
    // 6. Return user + tokens
    
    throw new Error('Not implemented - Task 1.2');
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    // TODO: Task 1.2
    // 1. Verify refresh token
    // 2. Check if refresh token exists in DB
    // 3. Generate new access token
    // 4. Return new access token
    
    throw new Error('Not implemented - Task 1.2');
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const logoutUser = async (userId) => {
  try {
    // TODO: Task 1.2
    // Delete refresh token from database
    
    throw new Error('Not implemented - Task 1.2');
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => {
  try {
    // TODO: Task 1.2
    // Fetch user without password
    
    throw new Error('Not implemented - Task 1.2');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserById
};
