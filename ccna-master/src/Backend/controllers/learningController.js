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
    const { title, description, level, status } = req.body;
    let thumbnailUrl = '';
    
    if (req.file) {
      thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level || 'BEGINNER',
        thumbnailUrl,
        status: status || 'DRAFT'
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
      where: { id: parseInt(id) },
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
      where: { id: parseInt(id) },
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
    const { title, description, courseId, difficulty } = req.body;
    let filePkaUrl = '';
    
    if (req.file) {
      filePkaUrl = `/uploads/labs/${req.file.filename}`;
    }

    const lab = await prisma.lab.create({
      data: {
        title,
        description,
        filePkaUrl,
        difficulty: difficulty || 'BEGINNER',
        courseId: courseId ? parseInt(courseId) : null
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
    
    const dataToUpdate = { 
      title, 
      description, 
      difficulty, 
      courseId: courseId ? parseInt(courseId) : undefined 
    };
    if (req.file) {
      dataToUpdate.filePkaUrl = `/uploads/labs/${req.file.filename}`;
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
