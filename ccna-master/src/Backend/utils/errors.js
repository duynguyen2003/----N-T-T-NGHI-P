/**
 * ============================================================
 * FILE: utils/errors.js
 * PURPOSE: Custom error classes for consistent error handling
 * CONSISTENCY: Unified error structure across API
 * ============================================================
 */

const { HTTP_STATUS, ERROR_TYPES } = require('../config/constants');

/**
 * Base application error class
 * Luôn định nghĩa statusCode và type
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_ERROR, type = ERROR_TYPES.INTERNAL_ERROR, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400 Bad Request)
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(
      message || 'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR,
      errors
    );
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication error (401 Unauthorized)
 * Khi user không login hoặc token không hợp lệ
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_TYPES.AUTHENTICATION_ERROR
    );
    this.name = 'UnauthorizedError';
  }
}

/**
 * Authorization error (403 Forbidden)
 * Khi user không có quyền truy cập
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_TYPES.AUTHORIZATION_ERROR
    );
    this.name = 'ForbiddenError';
  }
}

/**
 * Not found error (404 Not Found)
 * Khi resource không tìm thấy
 */
class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(
      message,
      HTTP_STATUS.NOT_FOUND,
      ERROR_TYPES.NOT_FOUND_ERROR
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error (409 Conflict)
 * Khi có duplicate data hoặc state conflict
 */
class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_TYPES.CONFLICT_ERROR
    );
    this.name = 'ConflictError';
  }
}

/**
 * Database error (500 Internal Server Error)
 * Khi có lỗi từ database
 */
class DatabaseError extends AppError {
  constructor(message = 'Database error') {
    super(
      message,
      HTTP_STATUS.INTERNAL_ERROR,
      ERROR_TYPES.DATABASE_ERROR
    );
    this.name = 'DatabaseError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  DatabaseError
};
