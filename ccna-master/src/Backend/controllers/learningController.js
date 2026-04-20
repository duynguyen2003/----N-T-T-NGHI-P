const { getPrisma } = require('../config/database');
const prisma = getPrisma();

module.exports.getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where: { deletedAt: null } })
    ]);

    res.json({
      data: courses,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createCourse = async (req, res, next) => {
  try {
    const { id, code, title, description, level, status, orderIndex } = req.body;
    let thumbnailUrl = '';
    
    if (req.file) {
      thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    }

    if (!code || !title) {
      return res.status(400).json({ message: 'Vui lòng nhập mã khóa học (code) và tên khóa học' });
    }

    const courseId = id || code.toLowerCase().replace(/\s/g, '');
    const course = await prisma.course.create({
      data: {
        id: courseId.substring(0, 10),
        code: code.substring(0, 10),
        title,
        description: description || null,
        level: level || 'BEGINNER',
        thumbnailUrl: thumbnailUrl || null,
        status: status || 'DRAFT',
        orderIndex: parseInt(orderIndex) || 0
      }
    });

    res.status(201).json({ message: 'Tạo khóa học thành công', course });
  } catch (error) {
    next(error);
  }
};

module.exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, level, status } = req.body;
    
    const dataToUpdate = { title, description, level, status };
    if (req.file) {
      dataToUpdate.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    }

    const course = await prisma.course.update({
      where: { id },
      data: dataToUpdate
    });

    res.json({ message: 'Cập nhật khóa học thành công', course });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DRAFT' }
    });
    res.json({ message: 'Xóa khóa học thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports.getLabs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [labs, total] = await Promise.all([
      prisma.lab.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { course: true }
      }),
      prisma.lab.count()
    ]);

    res.json({
      data: labs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createLab = async (req, res, next) => {
  try {
    const { title, category, difficulty, duration, guideContent, courseId, moduleId } = req.body;
    let fileUrl = null;
    
    if (req.file) {
      fileUrl = `/uploads/labs/${req.file.filename}`;
    }

    if (!title) {
      return res.status(400).json({ message: 'Vui lòng nhập tên bài Lab' });
    }

    const lab = await prisma.lab.create({
      data: {
        title,
        category: category || null,
        difficulty: difficulty || 'EASY',
        duration: duration || null,
        guideContent: guideContent || null,
        fileUrl,
        courseId: courseId || null,
        moduleId: moduleId || null
      }
    });

    res.status(201).json({ message: 'Tạo bài Lab thành công', lab });
  } catch (error) {
    next(error);
  }
};

module.exports.updateLab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, courseId, difficulty } = req.body;
    
    const diffMap = { 'BEGINNER': 'EASY', 'INTERMEDIATE': 'MEDIUM', 'ADVANCED': 'HARD' };

    const dataToUpdate = { 
      title, 
      guideContent: description, 
      difficulty: difficulty ? (diffMap[difficulty] || difficulty) : undefined, 
      courseId: courseId ? String(courseId) : undefined 
    };
    if (req.file) {
      dataToUpdate.fileUrl = `/uploads/labs/${req.file.filename}`;
    }

    const lab = await prisma.lab.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    res.json({ message: 'Cập nhật bài Lab thành công', lab });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteLab = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.lab.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Xóa bài Lab thành công' });
  } catch (error) {
    next(error);
  }
};

// =============================================
// MODULE (CHƯƠNG) MANAGEMENT
// =============================================

module.exports.getModulesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const modules = await prisma.module.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          where: { deletedAt: null },
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    res.json({ data: modules });
  } catch (error) {
    next(error);
  }
};

module.exports.createModule = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Vui lòng nhập tên chương' });
    }

    // Auto-generate short id (max 10 chars) and orderIndex
    const existingCount = await prisma.module.count({ where: { courseId } });
    const moduleId = `m${Date.now().toString().slice(-7)}`;

    const mod = await prisma.module.create({
      data: {
        id: moduleId,
        courseId,
        title,
        description: description || null,
        orderIndex: existingCount + 1
      }
    });

    res.status(201).json({ message: 'Tạo chương thành công', module: mod });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.module.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.json({ message: 'Xóa chương thành công' });
  } catch (error) {
    next(error);
  }
};

// =============================================
// LESSON (BÀI HỌC) MANAGEMENT
// =============================================

module.exports.getLessonsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const lessons = await prisma.lesson.findMany({
      where: { moduleId, deletedAt: null },
      orderBy: { orderIndex: 'asc' }
    });
    res.json({ data: lessons });
  } catch (error) {
    next(error);
  }
};

module.exports.createLesson = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { title, sectionNumber, contentHtml, videoUrl, videoDuration } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Vui lòng nhập tên bài học' });
    }

    const existingCount = await prisma.lesson.count({ where: { moduleId } });

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        sectionNumber: sectionNumber || null,
        contentHtml: contentHtml || null,
        videoUrl: videoUrl || null,
        videoDuration: videoDuration || null,
        orderIndex: existingCount + 1
      }
    });

    res.status(201).json({ message: 'Tạo bài học thành công', lesson });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });
    res.json({ message: 'Xóa bài học thành công' });
  } catch (error) {
    next(error);
  }
};

// =============================================
// COURSE TOPIC (CHỦ ĐỀ) MANAGEMENT
// =============================================

module.exports.getTopicsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const topics = await prisma.courseTopic.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' }
    });
    res.json({ data: topics });
  } catch (error) { next(error); }
};

module.exports.createTopic = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Vui lòng nhập tên chủ đề' });

    const count = await prisma.courseTopic.count({ where: { courseId } });
    const topic = await prisma.courseTopic.create({
      data: { courseId, title, orderIndex: count + 1 }
    });
    res.status(201).json({ message: 'Tạo chủ đề thành công', topic });
  } catch (error) { next(error); }
};

module.exports.deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.courseTopic.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Xóa chủ đề thành công' });
  } catch (error) { next(error); }
};

// =============================================
// RESOURCE (TÀI LIỆU) MANAGEMENT
// =============================================

module.exports.getResources = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const courseId = req.query.courseId || undefined;

    const where = courseId ? { courseId } : {};
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { course: { select: { title: true, code: true } } } }),
      prisma.resource.count({ where })
    ]);
    res.json({ data: resources, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

module.exports.createResource = async (req, res, next) => {
  try {
    const { title, type, size, courseId } = req.body;
    if (!title || !req.file) return res.status(400).json({ message: 'Vui lòng nhập tên và chọn file' });

    const resource = await prisma.resource.create({
      data: {
        title,
        type: type || req.file.mimetype.split('/')[1] || 'file',
        size: size || `${(req.file.size / 1024).toFixed(0)} KB`,
        fileUrl: `/uploads/resources/${req.file.filename}`,
        courseId: courseId || null
      }
    });
    res.status(201).json({ message: 'Tải tài liệu thành công', resource });
  } catch (error) { next(error); }
};

module.exports.deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (error) { next(error); }
};
