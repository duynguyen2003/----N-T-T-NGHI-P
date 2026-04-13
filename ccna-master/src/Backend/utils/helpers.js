/**
 * ============================================================
 * FILE: utils/helpers.js
 * PURPOSE: General helper functions
 * PERFORMANCE: Reusable utility functions
 * ============================================================
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getJWTSecret, getRefreshSecret } = require('../config/jwt');
const { PAGINATION } = require('../config/constants');

/**
 * Hash password
 * @param {string} password - Plain password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare passwords
 * @param {string} password - Plain password from input
 * @param {string} hash - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate access token
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: '15m'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: '7d'
  });
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

/**
 * Extract pagination parameters from query
 * @param {Object} query - Express query object
 * @returns {Object} {page, pageSize, skip}
 */
const getPaginationParams = (query) => {
  let page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
  let pageSize = parseInt(query.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;

  // Validate ranges
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  if (pageSize > PAGINATION.MAX_PAGE_SIZE) pageSize = PAGINATION.MAX_PAGE_SIZE;

  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip
  };
};

/**
 * Generate random token (for email verification, etc.)
 * @param {number} length - Token length (default 32)
 * @returns {string} Random token
 */
const generateRandomToken = (length = 32) => {
  return require('crypto')
    .randomBytes(length)
    .toString('hex');
};

/**
 * Check if email is valid format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user object (remove sensitive fields)
 * @param {Object} user - User object from database
 * @returns {Object} Sanitized user object
 */
const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...sanitized } = user;
  return sanitized;
};

/**
 * Calculate days since date
 * @param {Date} date - Date to calculate from
 * @returns {number} Days since date
 */
const daysSinceDate = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Format currency (VND)
 * @param {number} amount
 * @returns {string}
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getPaginationParams,
  generateRandomToken,
  isValidEmail,
  sanitizeUser,
  daysSinceDate,
  formatCurrency
};
