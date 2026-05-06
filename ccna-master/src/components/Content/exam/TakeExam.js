import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/ExamFlow.css';
import { useAuth } from '../../../context/AuthContext';

import { api } from '../../../services/Api';
// ─── Timer Hook ────────────────────────────────────────────────
// ─── Timer Hook ────────────────────────────────────────────────
const useTimer = (totalSeconds, initialLeft) => {
  const [timeLeft, setTimeLeft] = useState(initialLeft !== undefined ? initialLeft : totalSeconds);
  const [ready, setReady] = useState(totalSeconds > 0);

  useEffect(() => {
    if (totalSeconds > 0) {
      if (!ready) {
        setTimeLeft(initialLeft !== undefined ? initialLeft : totalSeconds);
        setReady(true);
      }
    }
  }, [totalSeconds, initialLeft, ready]);

  useEffect(() => {
    if (!ready || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, ready]);

  const format = (s) => {
    if (!ready) return "--:--:--";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const elapsed = ready ? totalSeconds - timeLeft : 0;
  const isWarning = ready && timeLeft > 0 && timeLeft < 300;

  return { timeLeft, elapsed, isWarning, formatted: format(timeLeft), ready };
};

// ─── Score Calculator ──────────────────────────────────────────
const calculateScore = (questions, answers, passingScore = 700) => {
  let correctCount = 0;
  questions.forEach((q) => {
    const userAns = answers[q.id] || [];
    const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
    
    // So sánh mảng đáp án (phải khớp hoàn toàn)
    if (userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val))) {
      correctCount++;
    }
  });
  const total = questions.length;
  const score = total > 0 ? Math.round((correctCount / total) * 1000) : 0;
  return { score, correct: correctCount, wrong: total - correctCount, total, pass: score >= passingScore };
};

// ─── Component ────────────────────────────────────────────────
const TakeExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { isAuthenticated, loading, token } = useAuth();

  const EXAM_DURATION = 90 * 60; // 90 phút tính bằng giây
  const STORAGE_KEY = `ccna_exam_session_${examId}`;

  // 1. Khôi phục state từ localStorage
  const getSavedSession = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  };

  const savedSession = getSavedSession();
  const initialQ = savedSession?.currentQ ?? 0;
  const initialAnswers = savedSession?.userAnswers || {};
  const initialFlags = savedSession?.flagged ? new Set(savedSession.flagged) : new Set();
  const initialTime = savedSession?.timeLeft > 0 ? savedSession.timeLeft : undefined;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentQ, setCurrentQ] = useState(initialQ);
  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [flagged, setFlagged] = useState(initialFlags);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch Exam Data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examData = await api.getExamById(token, examId);
        if (examData) {
          setExam(examData);
          setQuestions(examData.questions || []);
        }
      } catch (err) {
        console.error("Failed to fetch exam", err);
      } finally {
        setLoadingData(false);
      }
    };
    if (token) fetchExam();
  }, [examId, token]);

  // Chỉ tính duration khi exam đã tải xong (tránh dùng mặc định 90 phút sai)
  const duration = loadingData ? 0 : (exam?.durationMinutes ? exam.durationMinutes * 60 : EXAM_DURATION);
  const { timeLeft, elapsed, isWarning, formatted, ready } = useTimer(duration, initialTime);

  // Lưu state vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    const sessionData = {
      currentQ,
      userAnswers,
      flagged: Array.from(flagged),
      timeLeft,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [currentQ, userAnswers, flagged, timeLeft, STORAGE_KEY]);

  const question = questions[currentQ];
  const totalQ = questions.length;

  const selectAnswer = useCallback((index) => {
    setUserAnswers(prev => {
      const currentAnswers = prev[question.id] || [];
      const isMultiple = question.correctAnswer.length > 1;

      if (isMultiple) {
        // Toggle answer
        const next = currentAnswers.includes(index)
          ? currentAnswers.filter(i => i !== index)
          : [...currentAnswers, index];
        return { ...prev, [question.id]: next };
      } else {
        // Single choice
        return { ...prev, [question.id]: [index] };
      }
    });
  }, [question]);

  const toggleFlag = useCallback(() => {
    if (!question) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  }, [question]);

  // 2. Lắng nghe Phím tắt Keyboard (Shortcuts)
  useEffect(() => {
    if (showConfirm) return; // Vô hiệu hóa phím tắt khi hiện popup xác nhận

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && currentQ < totalQ - 1) {
        setCurrentQ(q => q + 1);
      } else if (e.key === 'ArrowLeft' && currentQ > 0) {
        setCurrentQ(q => q - 1);
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const keyMap = { 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D' };
        const selectedKey = keyMap[e.key.toLowerCase()];
        const optExists = question?.options?.some(opt => opt.key === selectedKey);
        if (optExists) selectAnswer(selectedKey);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, totalQ, question?.options, selectAnswer, toggleFlag, showConfirm]);

  const handleSubmit = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const result = calculateScore(questions, userAnswers, exam?.passingScore * 10);
    const elapsedMin = Math.floor(elapsed / 60);
    const elapsedSec = elapsed % 60;
    const timeString = `${String(elapsedMin).padStart(2,'0')}:${String(elapsedSec).padStart(2,'0')}`;
    navigate(`/exam/result/${examId}`, {
      state: {
        ...result,
        examId,
        examTitle: exam?.title || `CCNA Exam ${examId}`,
        timeUsed: timeString,
        userAnswers,
        questions: questions,
      }
    });
  }, [navigate, examId, userAnswers, elapsed, questions, exam]);

  // Tự động nộp khi hết giờ (chỉ khi bài thi đã chạy và thực sự chạm mốc 0)
  const timerStartedRef = React.useRef(false);
  useEffect(() => {
    if (timeLeft > 0) {
      timerStartedRef.current = true;
    }
    if (timerStartedRef.current && timeLeft === 0 && duration > 0) {
      handleSubmit();
    }
  }, [timeLeft, duration, handleSubmit]);

  const getQDotClass = (index) => {
    const q = questions[index];
    if (index === currentQ) return 'take-exam__q-dot take-exam__q-dot--active';
    if (flagged.has(q.id)) return 'take-exam__q-dot take-exam__q-dot--flagged';
    if (userAnswers[q.id] && userAnswers[q.id].length > 0) return 'take-exam__q-dot take-exam__q-dot--answered';
    return 'take-exam__q-dot take-exam__q-dot--unanswered';
  };

  if (loading || loadingData) {
    return (
      <div className="take-exam-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Đang tải bài thi...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="take-exam-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 560, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#0f172a' }}>Guest không được phép làm bài thi</h2>
          <p style={{ marginTop: 0, marginBottom: '1rem', color: '#64748b' }}>
            Bạn có thể xem thông tin tại Trung tâm Kiểm tra, nhưng cần đăng nhập để bắt đầu bài thi.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-prev"
              onClick={() => navigate('/exam/testing-center', { replace: true })}
            >
              Quay lại trung tâm
            </button>
            <button
              type="button"
              className="btn btn-submit"
              onClick={() => navigate('/login')}
            >
              Đăng nhập để làm bài
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question || questions.length === 0) {
    return (
      <div className="take-exam-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 560, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#0f172a' }}>Không có dữ liệu câu hỏi</h2>
          <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#64748b' }}>
            Bài thi này hiện tại chưa có câu hỏi nào. Vui lòng quay lại sau.
          </p>
          <button
            type="button"
            className="btn btn-prev"
            onClick={() => navigate('/exam/testing-center', { replace: true })}
          >
            Quay lại trung tâm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-exam-page">

      {/* Không dùng top navbar, để giao diện rộng hơn */ }

      {/* Body */}
      <div className="take-exam__body">

        {/* ── Question Card ── */}
        <div className="take-exam__question-card">
          {/* Meta */}
          <div className="take-exam__question-meta">
            <span className="take-exam__q-tag">CÂU HỎI {currentQ + 1}</span>
            <button className="take-exam__bookmark-btn" onClick={toggleFlag}>
              {flagged.has(question.id) ? '🚩' : '⚑'} ĐÁNH DẤU XEM LẠI
            </button>
          </div>

          {/* Image (nếu có) */}
          {question.imageUrl && (
            <div className="take-exam__q-image">
              <img src={question.imageUrl} alt="Exam topology" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          )}

          {/* Question Text */}
          <div className="take-exam__q-content" dangerouslySetInnerHTML={{ __html: question.question }} />

          {/* Options */}
          <div className="take-exam__options">
            <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '10px', fontWeight: 600 }}>
              {question.correctAnswer.length > 1 ? '(Chọn nhiều đáp án)' : '(Chọn 1 đáp án đúng)'}
            </div>
            {question.options.map((opt, idx) => {
              const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
              const isSelected = Array.isArray(userAnswers[question.id]) && userAnswers[question.id].includes(idx);
              return (
                <button
                  key={idx}
                  className={`take-exam__option ${isSelected ? 'take-exam__option--selected' : ''}`}
                  onClick={() => selectAnswer(idx)}
                >
                  <span className="take-exam__option-badge">{OPTION_LABELS[idx]}</span>
                  <span className="take-exam__option-text">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nav Buttons */}
          <div className="take-exam__nav">
            <button
              className="btn btn-prev"
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(q => q - 1)}
            >
              ← Câu trước
            </button>
            <span className="take-exam__nav-info">CÂU {currentQ + 1} TRÊN {totalQ}</span>
            {currentQ < totalQ - 1 ? (
              <button
                className="btn btn-next"
                onClick={() => setCurrentQ(q => q + 1)}
              >
                Câu kế tiếp →
              </button>
            ) : (
              <button
                className="btn btn-submit"
                onClick={() => setShowConfirm(true)}
              >
                Nộp bài thi ✓
              </button>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="take-exam__sidebar">
          {/* Thông tin Bài thi và Thời gian */}
          <div className="take-exam__sidebar-card" style={{ marginBottom: '1.5rem', textAlign: 'center', background: isWarning ? '#fef2f2' : 'white', border: isWarning ? '1px solid #fecaca' : '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isWarning ? '#dc2626' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              Chế độ thi: Đang diễn ra
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '2rem', fontWeight: 700, color: isWarning ? '#dc2626' : '#1e293b' }}>
              <span className="material-icons-round" style={{ fontSize: '2rem' }}>timer</span>
              {formatted}
            </div>
            {isWarning && <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '0.5rem' }}>Sắp hết giờ! Nhanh tay lên!</div>}
          </div>

          <div className="take-exam__sidebar-card">
            <div className="take-exam__sidebar-title">
              <span>Bản đồ câu hỏi</span>
              <span style={{ fontWeight: 400 }}>{totalQ} CÂU</span>
            </div>
            <div className="take-exam__q-grid">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={getQDotClass(index)}
                  onClick={() => setCurrentQ(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="take-exam__legend">
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#2563eb', borderRadius: '2px' }}></div>
                <span>Đã trả lời</span>
              </div>
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '2px' }}></div>
                <span>Hiện tại</span>
              </div>
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#f1f5f9', border: '2px solid #2563eb', borderRadius: '2px' }}></div>
                <span>Còn lại</span>
              </div>
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#f1f5f9', border: '1px solid #dc2626', borderRadius: '2px', position: 'relative' }}></div>
                <span>Xem lại sau</span>
              </div>
            </div>
          </div>

          <button className="take-exam__submit-btn" onClick={() => setShowConfirm(true)}>
            Nộp bài thi
          </button>
        </div>
      </div>

      {/* ── Confirm Submit Modal ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
              Xác nhận nộp bài?
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Bạn đã trả lời <strong>{Object.keys(userAnswers).length}/{totalQ}</strong> câu hỏi.
              {totalQ - Object.keys(userAnswers).length > 0 && ` Còn ${totalQ - Object.keys(userAnswers).length} câu chưa trả lời.`}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                style={{ padding: '0.7rem 1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setShowConfirm(false)}
              >
                Làm tiếp
              </button>
              <button
                style={{ padding: '0.7rem 1.5rem', border: 'none', borderRadius: '0.75rem', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                onClick={handleSubmit}
              >
                Nộp bài ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
