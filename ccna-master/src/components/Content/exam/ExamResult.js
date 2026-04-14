import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../../../css/ExamFlow.css';

// ─── Topic breakdown mock ──────────────────────────────────────
const TOPIC_BREAKDOWN = [
  { label: 'Network Fundamentals', pct: 95 },
  { label: 'Routing',              pct: 82 },
  { label: 'Switching',           pct: 88 },
  { label: 'Security',            pct: 70 },
  { label: 'Automation',          pct: 75 },
];

// ─── Component ────────────────────────────────────────────────
const ExamResult = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { state } = useLocation();

  // Nếu không có state (vào thẳng URL), dùng mock data
  const result = state || {
    score: 850,
    correct: 51,
    wrong: 9,
    total: 60,
    pass: true,
    timeUsed: '45:12',
    examTitle: `CCNA 200-301 Mock ${examId}`,
    userAnswers: {},
    questions: [],
  };

  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="exam-result-page">
      <div className="exam-result-container">

        {/* ── Hero Section ── */}
        <div className="er-hero">
          {/* Score Ring */}
          <div className="er-score-ring-wrapper">
            <div className="er-score-ring" style={{ borderColor: result.pass ? '#16a34a' : '#dc2626', boxShadow: `0 0 0 6px ${result.pass ? '#dcfce7' : '#fee2e2'}` }}>
              <span className="er-score-ring__icon">{result.pass ? '🏆' : '📋'}</span>
              <span className="er-score-ring__value">{result.score}</span>
              <span className="er-score-ring__denom">/ 1000 ĐIỂM</span>
            </div>
          </div>

          {/* Info */}
          <div className="er-hero-info">
            <span className={result.pass ? 'er-pass-badge' : 'er-fail-badge'}>
              {result.pass ? 'CHÚC MỪNG: PASS ✓' : 'KẾT QUẢ: FAIL ✕'}
            </span>
            <h1>Kết Quả Thi CCNA 200-301</h1>
            <p>
              {result.pass
                ? 'Bạn đã hoàn thành xuất sắc bài kiểm tra mô phỏng chứng chỉ quốc tế CCNA.'
                : 'Bạn chưa đạt ngưỡng điểm tối thiểu. Hãy ôn luyện thêm và thử lại nhé!'}
            </p>
            <div className="er-meta-tags">
              <div className="er-meta-tag">🏁 Điểm đạt: {result.score >= 825 ? '825' : '825'}</div>
              <div className="er-meta-tag">📅 {today}</div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="er-stats">
          <div className="er-stat-card">
            <div className="er-stat-card__label"><span>⏱</span> THỜI GIAN</div>
            <div className="er-stat-card__value">{result.timeUsed}</div>
            <div className="er-stat-card__sub">Giới hạn 90:00</div>
          </div>
          <div className="er-stat-card">
            <div className="er-stat-card__label" style={{ color: '#16a34a' }}><span>✅</span> CHÍNH XÁC</div>
            <div className="er-stat-card__value" style={{ color: '#16a34a' }}>{result.correct}</div>
            <div className="er-stat-card__sub">Câu trả lời đúng</div>
          </div>
          <div className="er-stat-card">
            <div className="er-stat-card__label" style={{ color: '#dc2626' }}><span>⊗</span> SAI</div>
            <div className="er-stat-card__value" style={{ color: '#dc2626' }}>{result.wrong}</div>
            <div className="er-stat-card__sub">Cần xem lại</div>
          </div>
          <div className="er-stat-card">
            <div className="er-stat-card__label"><span>⊖</span> BỎ TRỐNG</div>
            <div className="er-stat-card__value">0</div>
            <div className="er-stat-card__sub">Đã hoàn thành hết</div>
          </div>
        </div>

        {/* ── Topic Breakdown ── */}
        <div className="er-topic-section">
          <div className="er-topic-section__header">
            <div className="er-topic-section__title">
              <span>▐</span> Chi tiết từng chuyên đề
            </div>
            <div className="er-topic-section__actions">
              {/* CTA 1: Xem lại đáp án (Primary) */}
              <button
                className="er-btn-primary"
                onClick={() => navigate(`/exam/review/${examId}`, { state: result })}
              >
                ☰ Xem lại đáp án
              </button>
              {/* CTA 2: Quay về trang chủ (Secondary) */}
              <button
                className="er-btn-secondary"
                onClick={() => navigate('/exam/testing-center')}
              >
                🏠 Quay về trang chủ
              </button>
            </div>
          </div>

          <div className="er-topic-grid">
            {TOPIC_BREAKDOWN.map((topic) => (
              <div key={topic.label} className="er-topic-item">
                <div className="er-topic-item__header">
                  <span>{topic.label}</span>
                  <span className="er-topic-item__pct">{topic.pct}%</span>
                </div>
                <div className="er-progress-bar">
                  <div
                    className="er-progress-fill"
                    style={{
                      width: `${topic.pct}%`,
                      background: topic.pct >= 80 ? '#16a34a' : topic.pct >= 60 ? '#2563eb' : '#dc2626',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExamResult;
