import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/ExamFlow.css';
import { useAuth } from '../../../context/AuthContext';

// ─── Mock Questions ────────────────────────────────────────────
const MOCK_QUESTIONS = [
  {
    id: 1,
    domain: 'IP Connectivity',
    content: 'Lệnh nào sau đây được sử dụng để cấu hình định tuyến tĩnh đến mạng 192.168.1.0/24 qua 10.0.0.1?',
    options: [
      { key: 'A', text: 'ip route 192.168.1.0 255.255.255.0 10.0.0.1', isCode: true },
      { key: 'B', text: 'ip route 192.168.1.0 255.255.255.0 10.0.0.1', isCode: true },
      { key: 'C', text: 'ip route 10.0.0.1 255.255.255.0 192.168.1.0', isCode: true },
      { key: 'D', text: 'route ip 192.168.1.0 255.255.255.0 10.0.0.1', isCode: true },
    ],
    correct: 'B',
    hasImage: true,
  },
  {
    id: 2,
    domain: 'Network Fundamentals',
    content: 'Giao thức nào hoạt động ở tầng Transport và cung cấp kết nối hướng luồng (connection-oriented)?',
    options: [
      { key: 'A', text: 'UDP — User Datagram Protocol' },
      { key: 'B', text: 'ICMP — Internet Control Message Protocol' },
      { key: 'C', text: 'TCP — Transmission Control Protocol' },
      { key: 'D', text: 'ARP — Address Resolution Protocol' },
    ],
    correct: 'C',
    hasImage: false,
  },
  {
    id: 3,
    domain: 'Switching',
    content: 'Khi một switch nhận được frame với địa chỉ MAC đích chưa có trong bảng MAC, nó sẽ thực hiện hành động nào?',
    options: [
      { key: 'A', text: 'Drop frame và gửi ICMP error' },
      { key: 'B', text: 'Forward frame ra tất cả các port trừ port nhận vào (Flooding)' },
      { key: 'C', text: 'Gửi ARP Request để tìm địa chỉ MAC' },
      { key: 'D', text: 'Chuyển frame lên tầng Network để xử lý' },
    ],
    correct: 'B',
    hasImage: false,
  },
];

// ─── Timer Hook ────────────────────────────────────────────────
// ─── Timer Hook ────────────────────────────────────────────────
const useTimer = (totalSeconds, initialLeft) => {
  const [timeLeft, setTimeLeft] = useState(initialLeft !== undefined ? initialLeft : totalSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const format = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const elapsed = totalSeconds - timeLeft;
  const isWarning = timeLeft < 300; // Cảnh báo khi còn dưới 5 phút

  return { timeLeft, elapsed, isWarning, formatted: format(timeLeft) };
};

// ─── Score Calculator ──────────────────────────────────────────
const calculateScore = (answers) => {
  let correct = 0;
  MOCK_QUESTIONS.forEach((q) => {
    if (answers[q.id] === q.correct) correct++;
  });
  const total = MOCK_QUESTIONS.length;
  const score = Math.round((correct / total) * 1000);
  return { score, correct, wrong: total - correct, total, pass: score >= 825 };
};

// ─── Component ────────────────────────────────────────────────
const TakeExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { isAuthenticated, loading } = useAuth();

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
  const initialTime = savedSession?.timeLeft ?? EXAM_DURATION;

  const [currentQ, setCurrentQ] = useState(initialQ);
  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [flagged, setFlagged] = useState(initialFlags);
  const [showConfirm, setShowConfirm] = useState(false);

  const { timeLeft, elapsed, isWarning, formatted } = useTimer(EXAM_DURATION, initialTime);

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

  const question = MOCK_QUESTIONS[currentQ];
  const totalQ = MOCK_QUESTIONS.length;

  const selectAnswer = useCallback((key) => {
    setUserAnswers(prev => ({ ...prev, [question.id]: key }));
  }, [question.id]);

  const toggleFlag = useCallback(() => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  }, [question.id]);

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
        const optExists = question.options.some(opt => opt.key === selectedKey);
        if (optExists) selectAnswer(selectedKey);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, totalQ, question.options, selectAnswer, toggleFlag, showConfirm]);

  const handleSubmit = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY); // Xóa session khi đã nộp bài thành công
    const result = calculateScore(userAnswers);
    const elapsedMin = Math.floor(elapsed / 60);
    const elapsedSec = elapsed % 60;
    const timeString = `${String(elapsedMin).padStart(2,'0')}:${String(elapsedSec).padStart(2,'0')}`;
    navigate(`/exam/result/${examId}`, {
      state: {
        ...result,
        examId,
        examTitle: `CCNA 200-301 Mock ${examId}`,
        timeUsed: timeString,
        userAnswers,
        questions: MOCK_QUESTIONS,
      }
    });
  }, [navigate, examId, userAnswers, elapsed]);

  // Tự động nộp khi hết giờ
  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
  }, [timeLeft, handleSubmit]);

  const getQDotClass = (index) => {
    const q = MOCK_QUESTIONS[index];
    if (index === currentQ) return 'take-exam__q-dot take-exam__q-dot--active';
    if (flagged.has(q.id)) return 'take-exam__q-dot take-exam__q-dot--flagged';
    if (userAnswers[q.id]) return 'take-exam__q-dot take-exam__q-dot--answered';
    return 'take-exam__q-dot take-exam__q-dot--unanswered';
  };

  if (loading) {
    return null;
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

          {/* Image placeholder (nếu có) */}
          {question.hasImage && (
            <div className="take-exam__q-image-placeholder">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🖧</div>
                <div>Sơ đồ cấu trúc mạng (Topology)</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                  NGUỒN: Router A &nbsp;→&nbsp; ĐÍCH: 192.168.1.0/24
                </div>
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="take-exam__q-content">{question.content}</div>

          {/* Options */}
          <div className="take-exam__options">
            {question.options.map((opt) => {
              const isSelected = userAnswers[question.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  className={`take-exam__option ${isSelected ? 'take-exam__option--selected' : ''}`}
                  onClick={() => selectAnswer(opt.key)}
                >
                  <span className="take-exam__option-badge">{opt.key}</span>
                  <span className="take-exam__option-text" style={opt.isCode ? { fontFamily: 'monospace', fontSize: '0.88rem' } : {}}>
                    {opt.text}
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
              {MOCK_QUESTIONS.map((_, index) => (
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
