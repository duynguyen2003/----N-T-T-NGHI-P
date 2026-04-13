/**
 * ============================================================
 * FILE: middleware/validation.js
 * PURPOSE: Input validation middleware
 * SECURITY: Prevent invalid data from entering business logic
 * ============================================================
 */

const { ValidationError } = require('../utils/errors');
const { LIMITS } = require('../config/constants');

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters
 * @param {string} password
 * @returns {boolean}
 */
const isValidPassword = (password) => {
  return password && password.length >= LIMITS.MIN_PASSWORD_LENGTH;
};

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @throws {ValidationError} If any required field is missing
 */
const validateRequired = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} là bắt buộc`);
    }
  });

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
};

/**
 * Validate string length
 * @param {string} str - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If length is invalid
 */
const validateStringLength = (str, min, max, fieldName) => {
  if (!str || str.length < min || str.length > max) {
    throw new ValidationError(
      `Validation failed`,
      [`${fieldName} phải có độ dài từ ${min} đến ${max} ký tự`]
    );
  }
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If email is invalid
 */
const validateEmail = (email, fieldName = 'Email') => {
  if (!isValidEmail(email)) {
    throw new ValidationError(
      `Validation failed`,
      [`${fieldName} không hợp lệ`]
    );
  }
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If password is invalid
 */
const validatePassword = (password, fieldName = 'Password') => {
  if (!isValidPassword(password)) {
    throw new ValidationError(
      `Validation failed`,
      [`${fieldName} phải có ít nhất ${LIMITS.MIN_PASSWORD_LENGTH} ký tự`]
    );
  }
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If value is out of range
 */
const validateRange = (value, min, max, fieldName) => {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    throw new ValidationError(
      `Validation failed`,
      [`${fieldName} phải nằm trong khoảng ${min} - ${max}`]
    );
  }
};

/**
 * Validate enum value
 * @param {string} value - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If value is not in allowed values
 */
const validateEnum = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `Validation failed`,
      [`${fieldName} phải là một trong: ${allowedValues.join(', ')}`]
    );
  }
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRequired,
  validateStringLength,
  validateEmail,
  validatePassword,
  validateRange,
  validateEnum
};
