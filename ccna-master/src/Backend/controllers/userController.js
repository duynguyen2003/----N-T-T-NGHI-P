/**
 * ============================================================
 * FILE: controllers/userController.js
 * PURPOSE: Handle user management (get, update, delete, etc.)
 * TASKS: Task 1.4 - User Management Service
 * STATUS: Stub - to be implemented
 * ============================================================
 */

const { successResponse, listResponse, updatedResponse, deletedResponse } = require('../utils/response');

/**
 * GET /api/users
 * Get all users with pagination
 */
const getAllUsers = async (req, res, next) => {
  try {
    // TODO: Implement get all users
    // 1. Extract pagination params from query
    // 2. Fetch users from database
    // 3. Return paginated list

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.4'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    // TODO: Implement get user by ID
    // 1. Extract user ID from params
    // 2. Fetch user from database
    // 3. Return user (exclude password)

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.4'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    // TODO: Implement update user
    // 1. Extract user ID and update data
    // 2. Validate input
    // 3. Update user in database
    // 4. Return updated user

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.4'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Soft delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    // TODO: Implement delete user
    // 1. Extract user ID
    // 2. Soft delete user (set deletedAt)
    // 3. Return success message

    res.json({
      success: false,
      message: 'Not implemented yet - Task 1.4'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
