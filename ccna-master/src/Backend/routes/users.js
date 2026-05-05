const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Học viên xem Profile chính mình (cả hai đường dẫn đều hỗ trợ)
router.get('/profile', verifyToken, userController.getProfileMe);
router.get('/profile/me', verifyToken, userController.getProfileMe);

// Học viên xem tiến độ học tập
router.get('/progress', verifyToken, userController.getUserProgress);
router.post('/progress', verifyToken, userController.updateProgress);

module.exports = router;
