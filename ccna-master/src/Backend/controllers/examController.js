const { getPrisma } = require('../config/database');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
const { ValidationError } = require('../errors/validation-error');

const prisma = getPrisma();

const sanitizeQuestionsInput = (questions) => {
  if (!Array.isArray(questions)) {
    throw new ValidationError('Danh sách câu hỏi không hợp lệ');
  }

  if (questions.length === 0) {
    throw new ValidationError('Cần ít nhất 1 câu hỏi cho bài thi');
  }

  return questions.map((questionItem, index) => {
    const rawOptions = Array.isArray(questionItem.options) ? questionItem.options : [];
    const normalizedOptions = [0, 1, 2, 3].map((optionIndex) => `${rawOptions[optionIndex] || ''}`.trim());
    const questionText = `${questionItem.question || ''}`.trim();
    const correctAnswer = parseInt(questionItem.correctAnswer, 10);
    const imageUrl = `${questionItem.imageUrl || ''}`.trim() || null;

    if (!questionText) {
      throw new ValidationError(`Câu hỏi ${index + 1} không được để trống`);
    }

    if (normalizedOptions.some((option) => !option)) {
      throw new ValidationError(`Câu hỏi ${index + 1} cần đủ 4 đáp án`);
    }

    if (Number.isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      throw new ValidationError(`Câu hỏi ${index + 1} có đáp án đúng không hợp lệ`);
    }

    return {
      question: questionText,
      options: normalizedOptions,
      correctAnswer,
      explanation: `${questionItem.explanation || ''}`.trim() || null,
      imageUrl,
      orderIndex: index + 1
    };
  });
};

module.exports.getExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const whereClause = { deletedAt: null };
    if (req.user && req.user.role !== 'ADMIN') {
      whereClause.status = 'OPEN';
    }

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true, results: true } },
          course: { select: { title: true, code: true } },
          module: { select: { id: true, title: true } }
        }
      }),
      prisma.exam.count({ where: whereClause })
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
      durationMinutes,
      passingScore,
      difficulty,
      courseId,
      moduleId,
      questions
    } = req.body;

    if (!title || !durationMinutes) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ: Tên và Thời gian thi'
      });
    }

    const sanitizedQuestions = sanitizeQuestionsInput(questions || []);

    const exam = await prisma.exam.create({
      data: {
        title,
        examCode: examCode || null,
        totalQuestions: sanitizedQuestions.length,
        durationMinutes: parseInt(durationMinutes, 10),
        passingScore: parseInt(passingScore, 10) || 70,
        difficulty: difficulty || null,
        courseId: courseId || null,
        moduleId: moduleId || null,
        questions: {
          create: sanitizedQuestions
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json({ message: 'Tạo bài thi thành công', exam });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(error.statusCode || 400).json({ message: error.message });
    }
    next(error);
  }
};

module.exports.getExamById = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bài thi không hợp lệ' });
    }

    const whereClause = {
      id: examId,
      deletedAt: null
    };

    if (req.user && req.user.role !== 'ADMIN') {
      whereClause.status = 'OPEN';
    }

    const exam = await prisma.exam.findFirst({
      where: whereClause,
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: { select: { questions: true, results: true } },
        course: { select: { title: true, code: true } },
        module: { select: { id: true, title: true } }
      }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    }

    res.json({ exam });
  } catch (error) {
    next(error);
  }
};

module.exports.updateExam = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bài thi không hợp lệ' });
    }

    const {
      title,
      examCode,
      durationMinutes,
      passingScore,
      difficulty,
      courseId,
      moduleId,
      questions
    } = req.body;

    let sanitizedQuestions = null;
    if (questions !== undefined) {
      sanitizedQuestions = sanitizeQuestionsInput(questions);
    }

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title,
        examCode: examCode || null,
        totalQuestions: sanitizedQuestions ? sanitizedQuestions.length : undefined,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes, 10) : undefined,
        passingScore: passingScore !== undefined ? parseInt(passingScore, 10) : undefined,
        difficulty: difficulty || null,
        courseId: courseId || null,
        moduleId: moduleId || null,
        ...(sanitizedQuestions
          ? {
              questions: {
                deleteMany: {},
                create: sanitizedQuestions
              }
            }
          : {})
      },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    res.json({ message: 'Cập nhật bài thi thành công', exam });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    }
    next(error);
  }
};

module.exports.deleteExam = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bài thi không hợp lệ' });
    }

    const existing = await prisma.exam.findFirst({
      where: { id: examId, deletedAt: null }
    });
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    }

    await prisma.exam.update({
      where: { id: examId },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Xóa bài thi thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports.uploadQuestionImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn ảnh để tải lên.' });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file, {
      folder: 'ccna/exams/questions',
      resourceType: 'image'
    });

    res.status(201).json({
      message: 'Tải ảnh câu hỏi thành công',
      imageUrl: uploadResult.secure_url
    });
  } catch (error) {
    next(error);
  }
};
