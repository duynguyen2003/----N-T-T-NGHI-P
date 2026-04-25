const { getPrisma } = require('../config/database');
const { uploadBufferToCloudinary } = require('../config/cloudinary');

const prisma = getPrisma();

const sanitizeQuestionsInput = (questions) => {
  if (!Array.isArray(questions)) {
    return { error: 'Danh sach cau hoi khong hop le' };
  }

  if (questions.length === 0) {
    return { error: 'Can it nhat 1 cau hoi cho bai thi' };
  }

  const sanitizedQuestions = [];

  for (let index = 0; index < questions.length; index += 1) {
    const questionItem = questions[index] || {};
    const rawOptions = Array.isArray(questionItem.options) ? questionItem.options : [];
    const normalizedOptions = [0, 1, 2, 3].map((optionIndex) => `${rawOptions[optionIndex] || ''}`.trim());
    const questionText = `${questionItem.question || ''}`.trim();
    const correctAnswer = parseInt(questionItem.correctAnswer, 10);
    const imageUrl = `${questionItem.imageUrl || ''}`.trim() || null;

    if (!questionText) {
      return { error: `Cau hoi ${index + 1} khong duoc de trong` };
    }

    if (normalizedOptions.some((option) => !option)) {
      return { error: `Cau hoi ${index + 1} can du 4 dap an` };
    }

    if (Number.isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      return { error: `Cau hoi ${index + 1} co dap an dung khong hop le` };
    }

    sanitizedQuestions.push({
      question: questionText,
      options: normalizedOptions,
      correctAnswer,
      explanation: `${questionItem.explanation || ''}`.trim() || null,
      imageUrl,
      orderIndex: index + 1
    });
  }

  return { data: sanitizedQuestions };
};

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
        message: 'Vui long nhap day du: Ten, So cau hoi, Thoi gian'
      });
    }

    const questionsResult = sanitizeQuestionsInput(questions || []);
    if (questionsResult.error) {
      return res.status(400).json({ message: questionsResult.error });
    }
    const sanitizedQuestions = questionsResult.data;

    const exam = await prisma.exam.create({
      data: {
        title,
        examCode: examCode || null,
        totalQuestions: sanitizedQuestions.length || parseInt(totalQuestions, 10),
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

    res.status(201).json({ message: 'Tao bai thi thanh cong', exam });
  } catch (error) {
    next(error);
  }
};

module.exports.getExamById = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bai thi khong hop le' });
    }

    const exam = await prisma.exam.findFirst({
      where: {
        id: examId,
        deletedAt: null
      },
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
      return res.status(404).json({ message: 'Khong tim thay bai thi' });
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
      return res.status(400).json({ message: 'ID bai thi khong hop le' });
    }

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

    let sanitizedQuestions = null;

    if (questions !== undefined) {
      const questionsResult = sanitizeQuestionsInput(questions);
      if (questionsResult.error) {
        return res.status(400).json({ message: questionsResult.error });
      }
      sanitizedQuestions = questionsResult.data;
    }

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title,
        examCode: examCode || null,
        totalQuestions: sanitizedQuestions
          ? sanitizedQuestions.length
          : (totalQuestions !== undefined ? parseInt(totalQuestions, 10) : undefined),
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

    res.json({ message: 'Cap nhat bai thi thanh cong', exam });
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
    res.json({ message: 'Xoa bai thi thanh cong' });
  } catch (error) {
    next(error);
  }
};

module.exports.uploadQuestionImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui long chon anh de tai len.' });
    }

    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'File tai len phai la hinh anh.' });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file, {
      folder: 'ccna/exams/questions',
      resourceType: 'image'
    });

    res.status(201).json({
      message: 'Tai anh cau hoi thanh cong',
      imageUrl: uploadResult.secure_url
    });
  } catch (error) {
    next(error);
  }
};
