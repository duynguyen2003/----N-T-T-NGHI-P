const { getPrisma } = require('../config/database');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
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
      const uploadResult = await uploadBufferToCloudinary(req.file, {
        folder: 'ccna/courses/thumbnails',
        resourceType: 'image'
      });
      thumbnailUrl = uploadResult.secure_url;
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
    const { code, title, description, level, status, orderIndex } = req.body;

    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập tên khóa học' });
    }
    if (code !== undefined && !String(code).trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập mã khóa học' });
    }

    const dataToUpdate = {};
    if (code !== undefined) dataToUpdate.code = String(code).trim().substring(0, 10);
    if (title !== undefined) dataToUpdate.title = String(title).trim();
    if (description !== undefined) dataToUpdate.description = description ? String(description) : null;
    if (level !== undefined) dataToUpdate.level = level;
    if (status !== undefined) dataToUpdate.status = status;
    if (orderIndex !== undefined) {
      const parsedOrder = parseInt(orderIndex, 10);
      if (!Number.isNaN(parsedOrder)) dataToUpdate.orderIndex = parsedOrder;
    }

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file, {
        folder: 'ccna/courses/thumbnails',
        resourceType: 'image'
      });
      dataToUpdate.thumbnailUrl = uploadResult.secure_url;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'Không có dữ liệu cần cập nhật' });
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
    const { title, category, difficulty, duration, guideContent, courseId, moduleId, objective, tools, steps } = req.body;
    
    let fileUrl = null;
    let imageUrl = null;
    let topologyImgUrl = null;

    if (req.files) {
      if (req.files.filePka) {
        const uploadResult = await uploadBufferToCloudinary(req.files.filePka[0], {
          folder: 'ccna/labs/files',
          resourceType: 'auto'
        });
        fileUrl = uploadResult.secure_url;
      }
      if (req.files.thumbnailImg) {
        const uploadResult = await uploadBufferToCloudinary(req.files.thumbnailImg[0], {
          folder: 'ccna/labs/thumbnails',
          resourceType: 'image'
        });
        imageUrl = uploadResult.secure_url;
      }
      if (req.files.topologyImg) {
        const uploadResult = await uploadBufferToCloudinary(req.files.topologyImg[0], {
          folder: 'ccna/labs/topologies',
          resourceType: 'image'
        });
        topologyImgUrl = uploadResult.secure_url;
      }
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
        objective: objective || null,
        tools: tools ? (typeof tools === 'string' ? JSON.parse(tools) : tools) : null,
        steps: steps ? (typeof steps === 'string' ? JSON.parse(steps) : steps) : null,
        fileUrl,
        imageUrl,
        topologyImgUrl,
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
    const { title, category, difficulty, duration, guideContent, courseId, moduleId, objective, tools, steps } = req.body;
    
    const dataToUpdate = { 
      title, 
      category,
      difficulty,
      duration,
      guideContent,
      objective,
      courseId: courseId || null,
      moduleId: moduleId || null,
      tools: tools ? (typeof tools === 'string' ? JSON.parse(tools) : tools) : undefined,
      steps: steps ? (typeof steps === 'string' ? JSON.parse(steps) : steps) : undefined,
    };

    if (req.files) {
      if (req.files.filePka) {
        const uploadResult = await uploadBufferToCloudinary(req.files.filePka[0], {
          folder: 'ccna/labs/files',
          resourceType: 'auto'
        });
        dataToUpdate.fileUrl = uploadResult.secure_url;
      }
      if (req.files.thumbnailImg) {
        const uploadResult = await uploadBufferToCloudinary(req.files.thumbnailImg[0], {
          folder: 'ccna/labs/thumbnails',
          resourceType: 'image'
        });
        dataToUpdate.imageUrl = uploadResult.secure_url;
      }
      if (req.files.topologyImg) {
        const uploadResult = await uploadBufferToCloudinary(req.files.topologyImg[0], {
          folder: 'ccna/labs/topologies',
          resourceType: 'image'
        });
        dataToUpdate.topologyImgUrl = uploadResult.secure_url;
      }
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

module.exports.updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, orderIndex } = req.body;

    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập tên chương' });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = String(title).trim();
    if (description !== undefined) dataToUpdate.description = description ? String(description) : null;
    if (orderIndex !== undefined) {
      const parsedOrder = parseInt(orderIndex, 10);
      if (!Number.isNaN(parsedOrder)) dataToUpdate.orderIndex = parsedOrder;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'Không có dữ liệu cần cập nhật' });
    }

    const mod = await prisma.module.update({
      where: { id },
      data: dataToUpdate
    });

    res.json({ message: 'Cập nhật chương thành công', module: mod });
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

module.exports.updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, sectionNumber, contentHtml, videoUrl, videoDuration } = req.body;

    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập tên bài học' });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = String(title).trim();
    if (sectionNumber !== undefined) dataToUpdate.sectionNumber = sectionNumber ? String(sectionNumber) : null;
    if (contentHtml !== undefined) dataToUpdate.contentHtml = contentHtml ? String(contentHtml) : null;
    if (videoUrl !== undefined) dataToUpdate.videoUrl = videoUrl ? String(videoUrl) : null;
    if (videoDuration !== undefined) dataToUpdate.videoDuration = videoDuration ? String(videoDuration) : null;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'Không có dữ liệu cần cập nhật' });
    }

    const lesson = await prisma.lesson.update({
      where: { id: parseInt(id, 10) },
      data: dataToUpdate
    });

    res.json({ message: 'Cập nhật bài học thành công', lesson });
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
        fileUrl: (await uploadBufferToCloudinary(req.file, {
          folder: 'ccna/resources/files',
          resourceType: 'auto'
        })).secure_url,
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
