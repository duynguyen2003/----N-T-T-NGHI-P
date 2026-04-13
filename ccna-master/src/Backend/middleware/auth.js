/**
 * ============================================================
 * FILE: middleware/auth.js
 * PURPOSE: JWT authentication & authorization middleware
 * SECURITY: Token validation, role-based access control (simplified)
 * ============================================================
 */

const jwt = require('jsonwebtoken');
const { getJWTSecret } = require('../config/jwt');
const { ROLES } = require('../config/constants');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Xác thực token
 * Kiểm tra token có hợp lệ không và lấy user info
 * @middleware
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedError('Token không được cung cấp');
    }

    jwt.verify(token, getJWTSecret(), (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.message);
        throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn');
      }

      // Lưu user info vào request để sử dụng ở controller
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kiểm tra user có phải ADMIN không
 * Đơn giản: chỉ cần 2 roles (ADMIN hoặc STUDENT)
 * @middleware
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Bạn cần đăng nhập');
    }

    if (req.user.role !== ROLES.ADMIN) {
      throw new ForbiddenError('Chỉ Admin mới có quyền truy cập tài nguyên này');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  requireAdmin
};
