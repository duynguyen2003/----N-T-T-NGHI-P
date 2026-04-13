/**
 * ============================================================
 * FILE: validators/courseValidator.js
 * PURPOSE: Validation for course endpoints
 * TASKS: Task 1.7 - Input Validation Layer
 * STATUS: Stub
 * ============================================================
 */

const { validateRequired, validateStringLength } = require('../middleware/validation');
const { LIMITS } = require('../config/constants');

/**
 * Validate create course request
 * @param {Object} data
 * @throws {ValidationError}
 */
const validateCreateCourse = (data) => {
  validateRequired(data, ['title']);
  validateStringLength(data.title, 1, LIMITS.MAX_COURSE_TITLE, 'Title');
};

/**
 * Validate update course request
 * @param {Object} data
 * @throws {ValidationError}
 */
const validateUpdateCourse = (data) => {
  if (data.title) {
    validateStringLength(data.title, 1, LIMITS.MAX_COURSE_TITLE, 'Title');
  }
};

module.exports = {
  validateCreateCourse,
  validateUpdateCourse
};
