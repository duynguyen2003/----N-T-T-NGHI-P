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

module.exports.getExamById = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bài thi không hợp lệ' });
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
      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: 'Danh sách câu hỏi không hợp lệ' });
      }

      if (questions.length === 0) {
        return res.status(400).json({ message: 'Cần ít nhất 1 câu hỏi cho bài thi' });
      }

      sanitizedQuestions = [];
      for (let index = 0; index < questions.length; index += 1) {
        const questionItem = questions[index];
        const rawOptions = Array.isArray(questionItem.options) ? questionItem.options : [];
        const normalizedOptions = [0, 1, 2, 3].map((optionIndex) => `${rawOptions[optionIndex] || ''}`.trim());
        const questionText = `${questionItem.question || ''}`.trim();
        const correctAnswer = parseInt(questionItem.correctAnswer, 10);

        if (!questionText) {
          return res.status(400).json({ message: `Câu hỏi ${index + 1} không được để trống` });
        }

        if (normalizedOptions.some((option) => !option)) {
          return res.status(400).json({ message: `Câu hỏi ${index + 1} cần đủ 4 đáp án` });
        }

        if (Number.isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
          return res.status(400).json({ message: `Câu hỏi ${index + 1} có đáp án đúng không hợp lệ` });
        }

        sanitizedQuestions.push({
          question: questionText,
          options: normalizedOptions,
          correctAnswer,
          explanation: `${questionItem.explanation || ''}`.trim() || null,
          orderIndex: index + 1
        });
      }
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
