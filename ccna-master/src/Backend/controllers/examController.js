const { getPrisma } = require('../config/database');
const prisma = getPrisma();

module.exports.getExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true, results: true } },
          course: { select: { title: true, code: true } },
          module: { select: { id: true, title: true } }
        }
      }),
      prisma.exam.count({ where: { deletedAt: null } })
    ]);

    res.json({
      data: exams,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createExam = async (req, res, next) => {
  try {
    const {
      title,
      examCode,
      totalQuestions,
      durationMinutes,
      passingScore,
      difficulty,
      courseId,
      moduleId,
      questions
    } = req.body;

    if (!title || !totalQuestions || !durationMinutes) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ: Tên, Số câu hỏi, Thời gian'
      });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        examCode: examCode || null,
        totalQuestions: parseInt(totalQuestions, 10),
        durationMinutes: parseInt(durationMinutes, 10),
        passingScore: parseInt(passingScore, 10) || 70,
        difficulty: difficulty || null,
        courseId: courseId || null,
        moduleId: moduleId || null,
        questions: {
          create: (questions || []).map((questionItem, index) => ({
            question: questionItem.question,
            options: questionItem.options,
            correctAnswer: parseInt(questionItem.correctAnswer, 10),
            explanation: questionItem.explanation || null,
            orderIndex: index + 1
          }))
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json({ message: 'Tạo bài thi thành công', exam });
  } catch (error) {
    next(error);
  }
};

module.exports.updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      examCode,
      totalQuestions,
      durationMinutes,
      passingScore,
      difficulty,
      courseId,
      moduleId
    } = req.body;

    const exam = await prisma.exam.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        examCode,
        totalQuestions: totalQuestions ? parseInt(totalQuestions, 10) : undefined,
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
        passingScore: passingScore ? parseInt(passingScore, 10) : undefined,
        difficulty,
        courseId: courseId || null,
        moduleId: moduleId || null
      }
    });

    res.json({ message: 'Cập nhật bài thi thành công', exam });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.exam.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() }
    });
    res.json({ message: 'Xóa bài thi thành công' });
  } catch (error) {
    next(error);
  }
};
