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
    // Hỗ trợ số lượng đáp án linh hoạt (ít nhất 2)
    const normalizedOptions = rawOptions.map(opt => `${opt || ''}`.trim()).filter(opt => opt !== '');
    const questionText = `${questionItem.question || ''}`.trim();
    
    // Hỗ trợ chọn nhiều đáp án (Lưu dạng mảng index)
    let correctAnswers = questionItem.correctAnswer;
    if (!Array.isArray(correctAnswers)) {
      // Fallback cho dữ liệu cũ hoặc single choice gửi lên dạng số
      const single = parseInt(correctAnswers, 10);
      correctAnswers = Number.isNaN(single) ? [] : [single];
    } else {
      correctAnswers = correctAnswers.map(ans => parseInt(ans, 10)).filter(ans => !Number.isNaN(ans));
    }

    const imageUrl = `${questionItem.imageUrl || ''}`.trim() || null;

    if (!questionText) {
      throw new ValidationError(`Câu hỏi ${index + 1} không được để trống`);
    }

    if (normalizedOptions.length < 2) {
      throw new ValidationError(`Câu hỏi ${index + 1} cần ít nhất 2 đáp án`);
    }

    if (correctAnswers.length === 0) {
      throw new ValidationError(`Câu hỏi ${index + 1} chưa chọn đáp án đúng`);
    }

    if (correctAnswers.some(ans => ans < 0 || ans >= normalizedOptions.length)) {
      throw new ValidationError(`Câu hỏi ${index + 1} có đáp án đúng không hợp lệ`);
    }

    return {
      question: questionText,
      options: normalizedOptions,
      correctAnswer: correctAnswers, // Lưu mảng JSON vào DB
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
    if (!req.user || req.user.role !== 'ADMIN') {
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
      status,
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
        status: status || 'DRAFT',
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

    if (!req.user || req.user.role !== 'ADMIN') {
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

    // Xử lý questions: Thêm answerCount và bảo mật đáp án cho học viên
    const isAdmin = req.user && req.user.role === 'ADMIN';
    
    exam.questions = exam.questions.map(q => {
      let answerCount = 1;
      if (Array.isArray(q.correctAnswer)) {
        answerCount = q.correctAnswer.length;
      }
      
      if (!isAdmin) {
        const { correctAnswer, explanation, ...rest } = q;
        return { ...rest, answerCount };
      }
      
      return { ...q, answerCount };
    });

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
      status,
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
        status: status,
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

// --- SUBMIT EXAM ---
module.exports.submitExam = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { answers, timeSpent } = req.body;

    console.log('>>> [BACKEND] submitExam called:', { examId, userId, answersCount: Object.keys(answers || {}).length, timeSpent });

    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: 'ID bài thi không hợp lệ' });
    }

    // Idempotency: Chống spam (chặn nộp liên tục trong 30s)
    const recentAttempt = await prisma.examResult.findFirst({
      where: {
        examId,
        userId,
        takenAt: {
          gte: new Date(Date.now() - 30 * 1000)
        }
      }
    });

    if (recentAttempt) {
      return res.json({ message: 'Nộp bài thành công', resultId: recentAttempt.id });
    }

    const exam = await prisma.exam.findFirst({
      where: { id: examId, deletedAt: null },
      include: { questions: true }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy bài thi' });
    }

    // Chấm điểm
    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    exam.questions.forEach((q) => {
      const userAns = answers[q.id] || [];
      const correctAns = q.correctAnswer || [];

      if (userAns.length === correctAns.length && 
          userAns.every(v => correctAns.includes(v)) &&
          correctAns.every(v => userAns.includes(v))) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 1000) : 0;
    const percentage = totalQuestions > 0 ? parseFloat(((correctCount / totalQuestions) * 100).toFixed(2)) : 0;
    
    const passingScorePercent = exam.passingScore || 70;
    const isPassed = percentage >= passingScorePercent;

    const result = await prisma.examResult.create({
      data: {
        userId,
        examId,
        score,
        totalQuestions,
        percentage,
        isPassed,
        answers: answers || {},
        timeSpent: timeSpent || 0,
      }
    });

    res.json({ message: 'Nộp bài thành công', resultId: result.id });
  } catch (error) {
    next(error);
  }
};

// --- GET EXAM RESULT ---
module.exports.getExamResultById = async (req, res, next) => {
  try {
    const resultId = parseInt(req.params.resultId, 10);
    const userId = req.user.id;

    if (Number.isNaN(resultId)) {
      return res.status(400).json({ message: 'ID kết quả không hợp lệ' });
    }

    const result = await prisma.examResult.findFirst({
      where: { id: resultId, userId },
      include: { 
        exam: {
          include: { questions: true }
        }
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả bài thi' });
    }

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

// --- GET EXAM HISTORY ---
module.exports.getMyExamHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const history = await prisma.examResult.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
      include: {
        exam: {
          select: { title: true, examCode: true, passingScore: true, durationMinutes: true }
        }
      }
    });

    res.json({ data: history });
  } catch (error) {
    next(error);
  }
};
