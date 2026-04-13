/**
 * ============================================================
 * FILE: validators/authValidator.js
 * PURPOSE: Validation for authentication endpoints
 * TASKS: Task 1.7 - Input Validation Layer
 * STATUS: Stub
 * ============================================================
 */

const { validateRequired, validateEmail, validatePassword } = require('../middleware/validation');

/**
 * Validate register request
 * @param {Object} data - Request body
 * @throws {ValidationError}
 */
const validateRegister = (data) => {
  validateRequired(data, ['email', 'password', 'name']);
  validateEmail(data.email);
  validatePassword(data.password);
};

/**
 * Validate login request
 * @param {Object} data - Request body
 * @throws {ValidationError}
 */
const validateLogin = (data) => {
  validateRequired(data, ['email', 'password']);
  validateEmail(data.email);
};

/**
 * Validate refresh token request
 * @param {Object} data - Request body
 * @throws {ValidationError}
 */
const validateRefreshToken = (data) => {
  validateRequired(data, ['refreshToken']);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshToken
};
