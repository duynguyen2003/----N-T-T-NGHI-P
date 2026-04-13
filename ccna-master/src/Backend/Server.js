/**
 * ============================================================
 * FILE: Backend/Server.js
 * PURPOSE: Express server — chỉ có 3 route Auth (Register, Login, Logout)
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// DATABASE SETUP
// ============================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://postgres:123456@localhost:5432/netmastery_db',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Logger đơn giản
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`📨 ${req.method} ${req.path} — ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// ============================================================
// JWT HELPERS
// ============================================================

const JWT_SECRET  = process.env.JWT_SECRET  || 'netmastery_secret_key_2026';
const JWT_REFRESH = process.env.JWT_REFRESH_SECRET || 'netmastery_refresh_2026';

const signAccess  = (payload) => jwt.sign(payload, JWT_SECRET,  { expiresIn: '15m' });
const signRefresh = (payload) => jwt.sign(payload, JWT_REFRESH, { expiresIn: '7d' });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, passwordHash },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });

    const payload = { id: user.id, role: user.role, email: user.email, fullName: user.fullName };
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user,
      accessToken:  signAccess(payload),
      refreshToken: signRefresh(payload),
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email không tồn tại' });
    }
    if (!await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa' });
    }

    // Cập nhật lastLogin (không block response)
    prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } }).catch(() => {});

    const { passwordHash, ...safeUser } = user;
    const payload = { id: user.id, role: user.role, email: user.email, fullName: user.fullName };

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: safeUser,
      accessToken:  signAccess(payload),
      refreshToken: signRefresh(payload),
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST /api/auth/logout  (yêu cầu token hợp lệ)
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  // Stateless JWT — client xóa token phía mình là đủ
  res.json({ success: true, message: 'Đã đăng xuất' });
});

// Health check
app.get('/api/health', (_, res) => res.json({ success: true, message: 'Server đang chạy' }));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Không tìm thấy route: ${req.method} ${req.path}` });
});

// ============================================================
// START SERVER
// ============================================================

async function start() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Kết nối database thành công');
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  NetMastery Backend — Auth Only            ║
║  🚀 http://localhost:${PORT}/api             ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('❌ Không kết nối được database:', err.message);
    process.exit(1);
  }
}

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

start();