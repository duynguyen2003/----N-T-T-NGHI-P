/**
 * ============================================================
 * FILE: utils/response.js
 * PURPOSE: Unified API response formatting
 * CONSISTENCY: All API responses follow same structure
 * ============================================================
 */

/**
 * Success response format
 * @param {*} data - Data to return
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 * @returns {Object} Formatted response
 */
const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * List response format (with pagination)
 * @param {Array} items - Array of items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} pageSize - Items per page
 * @param {string} message - Optional message
 * @returns {Object} Formatted list response
 */
const listResponse = (items, total, page = 1, pageSize = 10, message = 'Success') => {
  return {
    success: true,
    data: items,
    pagination: {
      total: total,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize)
    },
    message: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Created response (201)
 * Dùng khi tạo resource mới
 * @param {*} data - Created data
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
const createdResponse = (data, message = 'Created successfully') => {
  return {
    success: true,
    data: data,
    message: message,
    timestamp: new Date().toISOString(),
    statusCode: 201
  };
};

/**
 * Updated response
 * Dùng khi update resource
 * @param {*} data - Updated data
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
const updatedResponse = (data, message = 'Updated successfully') => {
  return {
    success: true,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Deleted response
 * Dùng khi delete resource
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
const deletedResponse = (message = 'Deleted successfully') => {
  return {
    success: true,
    message: message,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  successResponse,
  listResponse,
  createdResponse,
  updatedResponse,
  deletedResponse
};
