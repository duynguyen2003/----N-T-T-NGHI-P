/**
 * ============================================================
 * FILE: routes/index.js
 * PURPOSE: Combine all route modules
 * ORGANIZATION: Central routing configuration
 * ============================================================
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const courseRoutes = require('./courses');
const moduleRoutes = require('./modules');
const lessonRoutes = require('./lessons');
const labRoutes = require('./labs');
const examRoutes = require('./exams');
const adminRoutes = require('./admin');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/lessons', lessonRoutes);
router.use('/labs', labRoutes);
router.use('/exams', examRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
