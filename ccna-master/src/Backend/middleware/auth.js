/**
 * ============================================================
 * MIDDLEWARE: auth.js
 * PURPOSE: Token verification and role-based access control
 * ============================================================
 */

const jwt = require('jsonwebtoken');

/**
 * @desc    Verify JWT from Authorization header
 */
module.exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có quyền truy cập (Missing token)' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ccna_master_secret_2024');
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * @desc    Check user role
 * @param   {string[]} roles - Allowed roles
 */
module.exports.checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  next();
};
