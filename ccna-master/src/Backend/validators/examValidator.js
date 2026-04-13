/**
 * ============================================================
 * FILE: validators/examValidator.js
 * PURPOSE: Validation for exam endpoints
 * TASKS: Task 1.7 - Input Validation Layer
 * STATUS: Stub
 * ============================================================
 */

const { validateRequired, validateStringLength } = require('../middleware/validation');
const { LIMITS } = require('../config/constants');

/**
 * Validate create exam request
 * @param {Object} data
 * @throws {ValidationError}
 */
const validateCreateExam = (data) => {
  validateRequired(data, ['courseId', 'title']);
  validateStringLength(data.title, 1, LIMITS.MAX_EXAM_TITLE, 'Title');
};

/**
 * Validate submit exam request
 * @param {Object} data
 * @throws {ValidationError}
 */
const validateSubmitExam = (data) => {
  validateRequired(data, ['answers']);
};

module.exports = {
  validateCreateExam,
  validateSubmitExam
};
