const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public (Requires Login)
router.get('/courses', verifyToken, learningController.getCourses);
router.get('/labs', verifyToken, learningController.getLabs);
router.get('/resources', verifyToken, learningController.getResources);

// Admin Restricted
router.use(verifyToken);
router.use(checkRole(['ADMIN']));

// Course management
router.post('/courses', upload.single('thumbnail'), learningController.createCourse);
router.put('/courses/:id', upload.single('thumbnail'), learningController.updateCourse);
router.delete('/courses/:id', learningController.deleteCourse);

// Lab management
router.post('/labs', upload.fields([
  { name: 'filePka', maxCount: 1 },
  { name: 'topologyImg', maxCount: 1 },
  { name: 'thumbnailImg', maxCount: 1 }
]), learningController.createLab);

router.put('/labs/:id', upload.fields([
  { name: 'filePka', maxCount: 1 },
  { name: 'topologyImg', maxCount: 1 },
  { name: 'thumbnailImg', maxCount: 1 }
]), learningController.updateLab);
router.delete('/labs/:id', learningController.deleteLab);

// Module (Chương) management
router.get('/courses/:courseId/modules', learningController.getModulesByCourse);
router.post('/courses/:courseId/modules', learningController.createModule);
router.put('/modules/:id', learningController.updateModule);
router.delete('/modules/:id', learningController.deleteModule);

// Lesson (Bài học) management
router.get('/modules/:moduleId/lessons', learningController.getLessonsByModule);
router.post('/modules/:moduleId/lessons', learningController.createLesson);
router.put('/lessons/:id', learningController.updateLesson);
router.delete('/lessons/:id', learningController.deleteLesson);

// CourseTopic (Chủ đề) management
router.get('/courses/:courseId/topics', learningController.getTopicsByCourse);
router.post('/courses/:courseId/topics', learningController.createTopic);
router.delete('/topics/:id', learningController.deleteTopic);

// Resource (Tài liệu) management
router.post('/resources', upload.single('file'), learningController.createResource);
router.delete('/resources/:id', learningController.deleteResource);

module.exports = router;
