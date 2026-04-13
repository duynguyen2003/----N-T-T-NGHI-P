/**
 * ============================================================
 * FILE: middleware/errorHandler.js
 * PURPOSE: Global error handling middleware
 * CONSISTENCY: Unified error response format
 * ============================================================
 */

const { HTTP_STATUS, ERROR_TYPES } = require('../config/constants');
const { AppError, ValidationError } = require('../utils/errors');

/**
 * Global error handling middleware
 * Xử lý tất cả lỗi từ các middleware/controller khác
 * PHẢI được đặt cuối cùng trong middleware stack
 * @middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log lỗi (trong production có thể gửi đến service logging)
  console.error('❌ Error:', {
    message: err.message,
    type: err.type || 'UNKNOWN',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Default error response
  let statusCode = HTTP_STATUS.INTERNAL_ERROR;
  let errorType = ERROR_TYPES.INTERNAL_ERROR;
  let message = 'Lỗi server nội bộ';
  let details = undefined;

  // Handle AppError (custom error class)
  if (err instanceof AppError) {
    statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
    errorType = err.type;
    message = err.message;
    details = err.details;
  }

  // Handle ValidationError (từ validator middleware)
  else if (err instanceof ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = ERROR_TYPES.VALIDATION_ERROR;
    message = err.message;
    details = err.errors; // Array of validation errors
  }

  // Handle Prisma errors
  else if (err.code === 'P2002') {
    // Unique constraint violation
    statusCode = HTTP_STATUS.CONFLICT;
    errorType = ERROR_TYPES.CONFLICT_ERROR;
    message = `${err.meta?.target?.[0] || 'Field'} đã tồn tại`;
  }
  else if (err.code === 'P2025') {
    // Record not found
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorType = ERROR_TYPES.NOT_FOUND_ERROR;
    message = 'Tài nguyên không tìm thấy';
  }
  else if (err.code && err.code.startsWith('P')) {
    // Other Prisma errors
    statusCode = HTTP_STATUS.INTERNAL_ERROR;
    errorType = ERROR_TYPES.DATABASE_ERROR;
    message = 'Lỗi database';
  }

  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
    message = 'Token không hợp lệ';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
    message = 'Token đã hết hạn';
  }

  // Unified error response format
  res.status(statusCode).json({
    success: false,
    error: {
      type: errorType,
      message: message,
      ...(details && { details }) // Chỉ thêm details nếu có
    },
    // Timestamp để tracking
    timestamp: new Date().toISOString(),
    // Path của request để debug
    path: req.path
  });
};

/**
 * 404 Not Found middleware
 * Gọi khi route không tìm thấy
 * @middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Không tìm thấy route: ${req.method} ${req.path}`,
    HTTP_STATUS.NOT_FOUND,
    ERROR_TYPES.NOT_FOUND_ERROR
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
