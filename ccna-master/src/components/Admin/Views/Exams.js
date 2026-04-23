import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Plus,
  Trash2,
  FileText,
  Search,
  CheckCircle2,
  Users,
  Target,
  Clock3,
  Eye,
  PencilLine,
  Settings2,
  Zap,
  ListChecks,
  AlignLeft,
  Upload,
  LayoutGrid,
  List,
  CalendarDays,
  ChevronsUpDown,
  CircleHelp,
  EyeOff,
  Shuffle
} from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const defaultFormData = {
  title: '',
  examCode: '',
  totalQuestions: 0,
  durationMinutes: 60,
  passingScore: 70,
  difficulty: '',
  courseId: '',
  moduleId: ''
};

const defaultQuestionDraft = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: ''
};

const getStatusFromExam = (exam) => ((exam?._count?.questions || 0) > 0 ? 'OPEN' : 'DRAFT');

const getDifficultyLabel = (difficulty) => {
  const mapping = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó'
  };
  return mapping[difficulty] || 'Chưa đặt';
};

const normalizeQuestionFromApi = (questionItem) => {
  const rawOptions = Array.isArray(questionItem?.options) ? questionItem.options : [];
  const normalizedOptions = OPTION_LABELS.map((_, optionIndex) => `${rawOptions[optionIndex] || ''}`);
  const normalizedCorrectAnswer = Number.isInteger(Number(questionItem?.correctAnswer))
    ? Number(questionItem.correctAnswer)
    : 0;

  return {
    question: `${questionItem?.question || ''}`,
    options: normalizedOptions,
    correctAnswer: Math.min(Math.max(normalizedCorrectAnswer, 0), 3),
    explanation: `${questionItem?.explanation || ''}`
  };
};

const Exams = () => {
  const { token } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [questions, setQuestions] = useState([]);
  const [questionDraft, setQuestionDraft] = useState(defaultQuestionDraft);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [hideResult, setHideResult] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    fetchExams();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExams(token, 1);
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModules = async (courseId) => {
    if (!courseId) {
      setModules([]);
      return;
    }

    try {
      const res = await adminApi.getModules(token, courseId);
      setModules(res.data || []);
    } catch (err) {
      console.error(err);
      setModules([]);
    }
  };

  const syncQuestions = (nextQuestions) => {
    setQuestions(nextQuestions);
    setFormData((prev) => ({
      ...prev,
      totalQuestions: nextQuestions.length
    }));
  };

  const resetQuestionDraft = () => {
    setQuestionDraft(defaultQuestionDraft);
    setEditingQuestionIndex(null);
  };

  const openCreateModal = () => {
    setSelectedExam(null);
    setIsEditMode(false);
    setError('');
    setModules([]);
    setFormData(defaultFormData);
    syncQuestions([]);
    resetQuestionDraft();
    setShowAdvanced(false);
    setShuffleQuestions(false);
    setHideResult(false);
    setIsModalOpen(true);
  };

  const openEditModal = async (exam) => {
    setSelectedExam(exam);
    setIsEditMode(true);
    setError('');
    syncQuestions([]);
    resetQuestionDraft();
    setShowAdvanced(false);
    setShuffleQuestions(false);
    setHideResult(false);
    setFormData({
      title: exam.title || '',
      examCode: exam.examCode || '',
      totalQuestions: exam.totalQuestions || 0,
      durationMinutes: exam.durationMinutes || 60,
      passingScore: exam.passingScore || 70,
      difficulty: exam.difficulty || '',
      courseId: exam.courseId || '',
      moduleId: exam.moduleId || ''
    });
    setIsModalOpen(true);
    try {
      const examDetailRes = await adminApi.getExamById(token, exam.id);
      const examDetail = examDetailRes.exam || exam;
      const mappedQuestions = (examDetail.questions || []).map((questionItem) => normalizeQuestionFromApi(questionItem));

      setSelectedExam(examDetail);
      setFormData({
        title: examDetail.title || '',
        examCode: examDetail.examCode || '',
        totalQuestions: mappedQuestions.length,
        durationMinutes: examDetail.durationMinutes || 60,
        passingScore: examDetail.passingScore || 70,
        difficulty: examDetail.difficulty || '',
        courseId: examDetail.courseId || '',
        moduleId: examDetail.moduleId || ''
      });
      syncQuestions(mappedQuestions);

      if (examDetail.courseId) {
        await fetchModules(examDetail.courseId);
      } else {
        setModules([]);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết bài thi.');
      setModules([]);
    }
  };

  const openViewModal = (exam) => {
    setSelectedExam(exam);
    setIsViewModalOpen(true);
  };

  const handleCourseChange = async (courseId) => {
    setFormData((prev) => ({
      ...prev,
      courseId,
      moduleId: ''
    }));
    await fetchModules(courseId);
  };

  const handleQuestionOptionChange = (index, value) => {
    setQuestionDraft((prev) => ({
      ...prev,
      options: prev.options.map((option, optionIndex) => (optionIndex === index ? value : option))
    }));
  };

  const handleSaveQuestion = () => {
    const trimmedQuestion = questionDraft.question.trim();
    const cleanedOptions = questionDraft.options.map((option) => option.trim());

    if (!trimmedQuestion) {
      setError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (cleanedOptions.some((option) => !option)) {
      setError('Vui lòng nhập đầy đủ 4 đáp án.');
      return;
    }

    const nextQuestion = {
      question: trimmedQuestion,
      options: cleanedOptions,
      correctAnswer: Number(questionDraft.correctAnswer) || 0,
      explanation: questionDraft.explanation.trim()
    };

    const nextQuestions = [...questions];
    if (editingQuestionIndex !== null) {
      nextQuestions[editingQuestionIndex] = nextQuestion;
    } else {
      nextQuestions.push(nextQuestion);
    }

    syncQuestions(nextQuestions);
    resetQuestionDraft();
    setError('');
  };

  const handleEditQuestion = (index) => {
    const targetQuestion = questions[index];
    setQuestionDraft({
      question: targetQuestion.question,
      options: [...targetQuestion.options],
      correctAnswer: targetQuestion.correctAnswer,
      explanation: targetQuestion.explanation || ''
    });
    setEditingQuestionIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    const nextQuestions = questions.filter((_, questionIndex) => questionIndex !== index);
    syncQuestions(nextQuestions);
    if (editingQuestionIndex === index) {
      resetQuestionDraft();
    }
  };

  const handleSubmitExam = async () => {
    try {
      setError('');
      if (!formData.title.trim()) throw new Error('Vui lòng nhập tên bài thi.');
      if (!formData.durationMinutes) throw new Error('Vui lòng nhập thời gian thi.');
      if (questions.length === 0) throw new Error('Cần ít nhất 1 câu hỏi cho bài thi.');

      if (isEditMode && selectedExam) {
        await adminApi.updateExam(token, selectedExam.id, {
          title: formData.title.trim(),
          examCode: formData.examCode.trim() || null,
          totalQuestions: questions.length,
          durationMinutes: formData.durationMinutes,
          passingScore: formData.passingScore,
          difficulty: formData.difficulty || null,
          courseId: formData.courseId || null,
          moduleId: formData.moduleId || null,
          questions
        });
      } else {
        await adminApi.createExam(token, {
          title: formData.title.trim(),
          examCode: formData.examCode.trim() || null,
          totalQuestions: questions.length,
          durationMinutes: formData.durationMinutes,
          passingScore: formData.passingScore,
          difficulty: formData.difficulty || null,
          courseId: formData.courseId || null,
          moduleId: formData.moduleId || null,
          questions
        });
      }

      setIsModalOpen(false);
      setFormData(defaultFormData);
      syncQuestions([]);
      setSelectedExam(null);
      setIsEditMode(false);
      setModules([]);
      resetQuestionDraft();
      setShowAdvanced(false);
      fetchExams();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài thi này?')) {
      try {
        await adminApi.deleteExam(token, id);
        fetchExams();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredExams = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return exams.filter((exam) => {
      const status = getStatusFromExam(exam);
      const matchesStatus = statusFilter === 'ALL' || statusFilter === status;
      const matchesKeyword = !keyword
        || (exam.title || '').toLowerCase().includes(keyword)
        || (exam.examCode || '').toLowerCase().includes(keyword)
        || (exam.course?.code || '').toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [exams, searchKeyword, statusFilter]);

  const examStats = useMemo(() => {
    const total = exams.length;
    const openCount = exams.filter((exam) => getStatusFromExam(exam) === 'OPEN').length;
    const totalAttempts = exams.reduce((sum, exam) => sum + (exam?._count?.results || 0), 0);
    const avgPassing = total
      ? Math.round(exams.reduce((sum, exam) => sum + (exam.passingScore || 0), 0) / total)
      : 0;

    return { total, openCount, totalAttempts, avgPassing };
  }, [exams]);

  const handleModalConfirm = () => {
    handleSubmitExam();
  };

  const formatExamDate = (value) => {
    if (!value) return '--/--/----';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--/--/----';
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <div>
          <h2>Quản lý Bài thi</h2>
          <p>Tạo đề trắc nghiệm, quản lý câu hỏi và chấm điểm tự động.</p>
        </div>

        <button className="exam-hub-create-btn" onClick={openCreateModal}>
          <Plus size={17} /> Tạo bài thi mới
        </button>
      </div>

      <div className="exam-hub-stats-grid">
        <div className="exam-hub-stat-card">
          <div className="exam-hub-stat-icon">
            <FileText size={20} />
          </div>
          <div>
            <strong>{examStats.total}</strong>
            <span>Tổng đề thi</span>
          </div>
        </div>

        <div className="exam-hub-stat-card is-open">
          <div className="exam-hub-stat-icon success">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <strong>{examStats.openCount}</strong>
            <span>Đang mở</span>
          </div>
        </div>

        <div className="exam-hub-stat-card">
          <div className="exam-hub-stat-icon warning">
            <Users size={20} />
          </div>
          <div>
            <strong>{examStats.totalAttempts}</strong>
            <span>Tổng lượt thi</span>
          </div>
        </div>

        <div className="exam-hub-stat-card">
          <div className="exam-hub-stat-icon purple">
            <Target size={20} />
          </div>
          <div>
            <strong>{examStats.avgPassing}/100</strong>
            <span>Điểm sàn TB</span>
          </div>
        </div>
      </div>

      <div className="exam-hub-toolbar-shell">
        <div className="exam-hub-toolbar">
          <div className="exam-hub-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tên kỳ thi..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </div>

          <div className="exam-hub-toolbar-right">
            <label className="exam-hub-select-wrap">
              <span>Trạng thái:</span>
              <select
                className="exam-hub-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">Tất cả</option>
                <option value="OPEN">Đang mở</option>
                <option value="DRAFT">Nháp</option>
              </select>
              <ChevronsUpDown size={14} />
            </label>

            <div className="exam-hub-view-toggle">
              <button
                type="button"
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                aria-label="Chế độ lưới"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                type="button"
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                aria-label="Chế độ danh sách"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="exam-hub-empty">Đang tải danh sách đề thi...</div>
      ) : filteredExams.length === 0 ? (
        <div className="exam-hub-empty">Không có đề thi phù hợp bộ lọc.</div>
      ) : viewMode === 'grid' ? (
        <div className="exam-hub-grid">
          {filteredExams.map((exam) => {
            const status = getStatusFromExam(exam);

            return (
              <article key={exam.id} className="exam-hub-card">
                <div className="exam-hub-card-top">
                  <h3>{exam.title}</h3>
                  <span className={`exam-hub-status ${status === 'OPEN' ? 'open' : 'draft'}`}>
                    {status === 'OPEN' ? 'Đang mở' : 'Nháp'}
                  </span>
                </div>

                <p className="exam-hub-meta">
                  Mã đề: <strong>{exam.examCode || '---'}</strong>
                  {' | '}
                  Khóa học: <strong>{exam.course?.code || 'Không gán'}</strong>
                </p>

                <div className="exam-hub-mini-stats">
                  <div>
                    <CircleHelp size={14} />
                    <strong>{exam.totalQuestions}</strong>
                    <span>Câu hỏi</span>
                  </div>
                  <div>
                    <Clock3 size={14} />
                    <strong>{exam.durationMinutes}p</strong>
                    <span>Thời gian</span>
                  </div>
                  <div>
                    <Target size={14} />
                    <strong>{exam.passingScore}%</strong>
                    <span>Điểm đạt</span>
                  </div>
                  <div>
                    <Users size={14} />
                    <strong>{exam?._count?.results || 0}</strong>
                    <span>Dự thi</span>
                  </div>
                </div>

                <div className="exam-hub-bottom">
                  <span className="exam-hub-difficulty">{getDifficultyLabel(exam.difficulty)}</span>
                  <div className="exam-hub-actions">
                    <button type="button" onClick={() => openViewModal(exam)}>
                      <Eye size={14} /> Xem
                    </button>
                    <button type="button" onClick={() => openEditModal(exam)}>
                      <PencilLine size={14} /> Sửa
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(exam.id)}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="exam-hub-list-shell">
          <div className="exam-hub-list-head">
            <span>THÔNG TIN KỲ THI</span>
            <span>KHÓA HỌC</span>
            <span>CHI TIẾT</span>
            <span>TRẠNG THÁI</span>
            <span>THAO TÁC</span>
          </div>

          <div className="exam-hub-list-body">
            {filteredExams.map((exam) => {
              const status = getStatusFromExam(exam);

              return (
                <article key={exam.id} className="exam-hub-list-row">
                  <div className="exam-hub-col exam-hub-col-info">
                    <div className="exam-hub-exam-icon">
                      <FileText size={24} />
                    </div>
                    <div className="exam-hub-exam-main">
                      <h3>{exam.title}</h3>
                      <div className="exam-hub-exam-sub">
                        <span className="exam-hub-chip">ID: {exam.examCode || '---'}</span>
                        <span className="exam-hub-date">
                          <CalendarDays size={14} />
                          {formatExamDate(exam.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="exam-hub-col exam-hub-col-course">
                    <span className="exam-hub-course-pill">{exam.course?.code || 'N/A'}</span>
                  </div>

                  <div className="exam-hub-col exam-hub-col-detail">
                    <div>
                      <CircleHelp size={14} />
                      <span>{exam.totalQuestions} câu hỏi</span>
                    </div>
                    <div>
                      <Target size={14} />
                      <span>{exam.passingScore}% đạt</span>
                    </div>
                    <div>
                      <Clock3 size={14} />
                      <span>{exam.durationMinutes} phút</span>
                    </div>
                    <div>
                      <Users size={14} />
                      <span>{exam?._count?.results || 0} dự thi</span>
                    </div>
                  </div>

                  <div className="exam-hub-col exam-hub-col-status">
                    <span className={`exam-hub-status ${status === 'OPEN' ? 'open' : 'draft'}`}>
                      {status === 'OPEN' ? 'Đang mở' : 'Nháp'}
                    </span>
                    <small>{getDifficultyLabel(exam.difficulty)}</small>
                  </div>

                  <div className="exam-hub-col exam-hub-col-actions">
                    <button type="button" className="icon view" onClick={() => openViewModal(exam)} aria-label="Xem kỳ thi">
                      <Eye size={18} />
                    </button>
                    <button type="button" className="icon edit" onClick={() => openEditModal(exam)} aria-label="Sửa kỳ thi">
                      <PencilLine size={18} />
                    </button>
                    <button type="button" className="icon delete" onClick={() => handleDelete(exam.id)} aria-label="Xóa kỳ thi">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="exam-hub-footnote">Dữ liệu được cập nhật thời gian thực từ hệ thống.</p>
        </div>
      )}
      <AdminModal className="efb-modal"
        title={isEditMode ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}
        description="Thiết lập cấu trúc và nội dung cho kỳ thi."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        confirmText="Lưu bài thi"
        minWidth="780px"
        maxWidth="960px"
        bodyMaxHeight="82vh"
      >
        <div className="efb-shell">

          {/* â”€â”€ Section 1: ThÃ´ng tin cÆ¡ báº£n â”€â”€ */}
          <section className="efb-card">
            <div className="efb-card-header">
              <div className="efb-card-badge efb-bg-purple">
                <ListChecks size={15} />
              </div>
              <span>Thông Tin Cơ Bản</span>
            </div>

            {error && <p className="exam-builder-error">{error}</p>}

            <div className="efb-row-flex">
              <label className="efb-field efb-flex-15">
                <span>Tiêu đề bài thi *</span>
                <input
                  className="efb-input"
                  placeholder="VD: Kiểm tra giữa kỳ..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>

              <label className="efb-field efb-flex-12">
                <span>Chuyên môn</span>
                <select
                  className="efb-input"
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} – {c.title}</option>
                  ))}
                </select>
              </label>

              <label className="efb-field efb-flex-07">
                <span><Clock3 size={13} className="efb-icon-fix" /> Thời gian</span>
                <input
                  type="number"
                  className="efb-input"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 0 })}
                />
              </label>
            </div>
          </section>

          {/* â”€â”€ Section 2: ThÃªm cÃ¢u há»i â”€â”€ */}
          <section className="efb-card efb-card-blue">
              <div className="efb-card-header">
                <div className="efb-card-badge efb-bg-blue">
                  <Zap size={15} />
                </div>
                <span>{isEditMode ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Nhanh'}</span>
                {!isEditMode && <span className="efb-header-right">TIẾN NHANH THÔNG MINH</span>}
              </div>

              {/* Question type cards */}
              <div className="efb-type-grid">
                <button type="button" className="efb-type-card efb-type-active">
                  <div className="efb-type-icon efb-type-icon-purple">
                    <ListChecks size={20} />
                  </div>
                  <strong>Trắc nghiệm</strong>
                  <span>Nhiều lựa chọn, tự động chấm điểm</span>
                </button>
                <button type="button" className="efb-type-card">
                  <div className="efb-type-icon efb-type-icon-blue">
                    <AlignLeft size={20} />
                  </div>
                  <strong>Tự luận</strong>
                  <span>Dạng văn bản, giáo viên chấm điểm</span>
                </button>
                <button type="button" className="efb-type-card">
                  <div className="efb-type-icon efb-type-icon-cyan">
                    <Upload size={20} />
                  </div>
                  <strong>Nhập từ File</strong>
                  <span>Nhập hàng loạt từ Excel / CSV</span>
                </button>
              </div>

              {/* Draft editor */}
              <div className="efb-draft">
                <label className="efb-field efb-field-full">
                  <input
                    className="efb-input efb-question-input"
                    placeholder="Nhập nội dung câu hỏi..."
                    value={questionDraft.question}
                    onChange={(e) => setQuestionDraft((p) => ({ ...p, question: e.target.value }))}
                  />
                </label>

                <div className="efb-options-grid">
                  {questionDraft.options.map((opt, i) => (
                    <div key={i} className={`efb-option-item ${questionDraft.correctAnswer === i ? 'efb-option-correct' : ''}`}>
                      <button
                        type="button"
                        className="efb-option-radio"
                        onClick={() => setQuestionDraft((p) => ({ ...p, correctAnswer: i }))}
                      >
                        {questionDraft.correctAnswer === i ? <CheckCircle2 size={16} /> : <span className="efb-radio-dot" />}
                      </button>
                      <input
                        className="efb-option-input"
                        placeholder={`Đáp án ${OPTION_LABELS[i]}`}
                        value={opt}
                        onChange={(e) => handleQuestionOptionChange(i, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="efb-draft-footer">
                  <label className="efb-field efb-flex-1">
                    <span>Đáp án Đúng</span>
                    <select
                      className="efb-input"
                      value={questionDraft.correctAnswer}
                      onChange={(e) => setQuestionDraft((p) => ({ ...p, correctAnswer: parseInt(e.target.value, 10) || 0 }))}
                    >
                      {OPTION_LABELS.map((lbl, i) => (
                        <option key={lbl} value={i}>Đáp án {lbl}</option>
                      ))}
                    </select>
                  </label>
                  <label className="efb-field efb-flex-2">
                    <span>Giải thích / Ghi chú điểm số</span>
                    <input
                      className="efb-input"
                      placeholder="Nhập gợi ý hoặc giải thích đáp án..."
                      value={questionDraft.explanation}
                      onChange={(e) => setQuestionDraft((p) => ({ ...p, explanation: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="efb-draft-actions">
                  <button type="button" className="efb-btn-ghost" onClick={resetQuestionDraft}>
                    Thêm câu hỏi mới theo cách thủ công
                  </button>
                  <div className="efb-gap-8">
                    {editingQuestionIndex !== null && (
                      <button type="button" className="efb-btn-secondary" onClick={resetQuestionDraft}>Hủy</button>
                    )}
                    <button type="button" className="efb-btn-primary" onClick={handleSaveQuestion}>
                      <Plus size={15} />
                      {editingQuestionIndex !== null ? 'Cập nhật' : 'Thêm câu hỏi'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Question list */}
              {questions.length > 0 && (
                <div className="efb-qlist">
                  <div className="efb-qlist-header">
                    <FileText size={15} />
                    <span>Danh Sách Câu Hỏi ({questions.length})</span>
                  </div>
                  {questions.map((q, idx) => (
                    <div key={idx} className="efb-qcard">
                      <div className="efb-qcard-top">
                        <span className="efb-qnum">{idx + 1}</span>
                        <p className="efb-qtext">{q.question}</p>
                        <div className="efb-qcard-actions">
                          <button type="button" className="efb-icon-btn" onClick={() => handleEditQuestion(idx)}>
                            <PencilLine size={14} />
                          </button>
                          <button type="button" className="efb-icon-btn efb-icon-danger" onClick={() => handleDeleteQuestion(idx)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="efb-qoptions">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`efb-qoption ${q.correctAnswer === oi ? 'correct' : ''}`}>
                            {q.correctAnswer === oi
                              ? <CheckCircle2 size={13} className="efb-qoption-correct-icon" />
                              : <span className="efb-qoption-dot" />}
                            <span>{opt || `(Đáp án ${OPTION_LABELS[oi]} trống)`}</span>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="efb-qexplan">
                          <span>Giải thích:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          {/* â”€â”€ Section 3: CÃ i Ä‘áº·t nÃ¢ng cao â”€â”€ */}
          <section className="efb-card efb-card-orange">
            <div className="efb-card-header">
              <div className="efb-card-badge efb-bg-orange">
                <Settings2 size={15} />
              </div>
              <span>Cài Đặt Nâng Cao</span>
            </div>

            <div className="efb-row">
              <label className="efb-field">
                <span>Điểm sàn (%)</span>
                <input
                  type="number"
                  className="efb-input"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value, 10) || 70 })}
                />
              </label>
              <label className="efb-field">
                <span>Độ khó</span>
                <select
                  className="efb-input"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="">Không chọn</option>
                  <option value="EASY">Dễ</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Khó</option>
                </select>
              </label>
            </div>

            <div className="efb-toggle-list">
              <div className="efb-toggle-item">
                <div className="efb-toggle-info">
                  <div className="efb-toggle-icon"><Shuffle size={16} /></div>
                  <div>
                    <strong>Trộn câu hỏi</strong>
                    <span>Xáo trộn câu hỏi ngẫu nhiên cho mỗi học sinh</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`efb-toggle-btn ${shuffleQuestions ? 'on' : ''}`}
                  onClick={() => setShuffleQuestions((p) => !p)}
                >
                  <span />
                </button>
              </div>

              <div className="efb-toggle-item">
                <div className="efb-toggle-info">
                  <div className="efb-toggle-icon"><EyeOff size={16} /></div>
                  <div>
                    <strong>Ẩn kết quả thi</strong>
                    <span>Giấu điểm và đáp án sau khi học sinh nộp bài</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`efb-toggle-btn ${hideResult ? 'on' : ''}`}
                  onClick={() => setHideResult((p) => !p)}
                >
                  <span />
                </button>
              </div>
            </div>
          </section>

        </div>
      </AdminModal>

      <AdminModal
        title="Chi tiết đề thi"
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onConfirm={() => setIsViewModalOpen(false)}
        confirmText="Đóng"
      >
        {selectedExam && (
          <div className="exam-view-details">
            <div><b>Tiêu đề:</b> {selectedExam.title}</div>
            <div><b>Mã đề:</b> {selectedExam.examCode || '---'}</div>
            <div><b>Khóa học:</b> {selectedExam.course?.title || 'Không gán khóa học'}</div>
            <div><b>Chương:</b> {selectedExam.module?.title || selectedExam.moduleId || 'Không gán chương'}</div>
            <div><b>Số câu hỏi:</b> {selectedExam.totalQuestions}</div>
            <div><b>Thời gian:</b> {selectedExam.durationMinutes} phút</div>
            <div><b>Điểm đạt:</b> {selectedExam.passingScore}%</div>
            <div><b>Độ khó:</b> {getDifficultyLabel(selectedExam.difficulty)}</div>
            <div><b>Lượt dự thi:</b> {selectedExam?._count?.results || 0}</div>
            <div><b>Trạng thái:</b> {getStatusFromExam(selectedExam) === 'OPEN' ? 'Đang mở' : 'Nháp'}</div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default Exams;


