const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Học viên xem Profile chính mình
router.get('/profile/me', verifyToken, userController.getProfileMe);

module.exports = router;
