/**
 * ============================================================
 * CONTROLLER: authController.js
 * PURPOSE: Handle user registration and login logic
 * ============================================================
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPrisma } = require('../config/database');

const prisma = getPrisma();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
module.exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email này đã được sử dụng' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: 'STUDENT'
      }
    });

    // 5. Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'ccna_master_secret_2024',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // 5. Update last login (optional but good)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // 6. Return user and token
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Đăng nhập thành công',
      accessToken: token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * @desc    Get current user profile (Placeholder for now)
 * @route   GET /api/auth/profile
 * @access  Private
 */
module.exports.getProfile = async (req, res, next) => {
  try {
    // req.user sẽ được set bởi authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: 'Không được phép truy cập' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
