/**
 * ============================================================
 * FILE: config/constants.js
 * PURPOSE: Application-wide constants (Roles, permissions, etc.)
 * PERFORMANCE: Centralized constants to avoid magic strings
 * ============================================================
 */

/**
 * User Roles (Simplified: 2 roles only)
 * STUDENT: Người học - chỉ học tập
 * ADMIN: Admin - quản lý tất cả
 */
const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN'
};

/**
 * Admin Actions (để log)
 * Các hành động của admin có thể tracking
 */
const ADMIN_ACTIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
  ASSIGN_ROLE: 'ASSIGN_ROLE'
};

/**
 * HTTP Status Codes
 * Codes có thể sử dụng trong API responses
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

/**
 * Error Types
 * Phân loại lỗi cho quản lý tập trung
 */
const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

/**
 * Progress Status
 * Trạng thái tiến độ học tập
 */
const PROGRESS_STATUS = {
  LOCKED: 'LOCKED',       // Chưa mở
  ACTIVE: 'ACTIVE',       // Đang học
  COMPLETED: 'COMPLETED'  // Hoàn thành
};

/**
 * Pagination Defaults
 * Giá trị mặc định cho phân trang
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

/**
 * Application Limits
 * Giới hạn cho các thành phần
 */
const LIMITS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MAX_COURSE_TITLE: 200,
  MAX_MODULE_TITLE: 200,
  MAX_LESSON_TITLE: 200,
  MAX_LAB_TITLE: 200,
  MAX_EXAM_TITLE: 200,
  MAX_EMAIL_LENGTH: 150
};

module.exports = {
  ROLES,
  ADMIN_ACTIONS,
  HTTP_STATUS,
  ERROR_TYPES,
  PROGRESS_STATUS,
  PAGINATION,
  LIMITS
};
