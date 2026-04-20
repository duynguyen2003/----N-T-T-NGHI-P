const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public (Requires Login)
router.get('/courses', verifyToken, learningController.getCourses);
router.get('/labs', verifyToken, learningController.getLabs);

// Admin Restricted
router.use(verifyToken);
router.use(checkRole(['ADMIN']));

// Course management
router.post('/courses', upload.single('thumbnail'), learningController.createCourse);
router.put('/courses/:id', upload.single('thumbnail'), learningController.updateCourse);
router.delete('/courses/:id', learningController.deleteCourse);

// Lab management
router.post('/labs', upload.single('filePka'), learningController.createLab);
router.put('/labs/:id', upload.single('filePka'), learningController.updateLab);
router.delete('/labs/:id', learningController.deleteLab);

module.exports = router;
