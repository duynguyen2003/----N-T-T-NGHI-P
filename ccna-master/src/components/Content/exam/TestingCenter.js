import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../css/ExamFlow.css';

// ─── Mock Data ────────────────────────────────────────────────
const MODULES = [
  {
    id: 'm1',
    icon: '⚙️',
    color: '#2563eb',
    bg: '#eff6ff',
    title: 'Module 1: Network Fundamentals',
    meta: '4 Quizzes • 65 Questions Total',
    quizzes: [
      { id: 'q1', code: 'OSI', label: 'Quiz 1.1: OSI Model & TCP/IP', info: '10 questions · 15 mins', score: '8/10', scoreLabel: 'ĐIỂM CAO NHẤT' },
      { id: 'q2', code: 'CAB', label: 'Quiz 1.2: Cabling & Interfaces', info: '15 questions · 20 mins', score: null, scoreLabel: 'TRẠNG THÁI', scoreSub: 'Chưa làm' },
    ],
  },
  {
    id: 'm2',
    icon: '🔌',
    color: '#059669',
    bg: '#ecfdf5',
    title: 'Module 2: IP Connectivity',
    meta: '6 Quizzes • 120 Questions Total',
    quizzes: [],
  },
  {
    id: 'm3',
    icon: '🛡️',
    color: '#94a3b8',
    bg: '#f1f5f9',
    title: 'Module 3: IP Services & Security',
    meta: '5 Quizzes • 85 Questions Total',
    locked: true,
    quizzes: [],
  },
];

const MOCK_EXAMS = [
  { id: 'mock-01', title: 'Mock Exam 01', badge: 'HARD', badgeClass: 'badge-hard', icon: '⚙️', meta: ['120 mins', '100 questions', 'Simulated Labs Included'] },
  { id: 'mock-02', title: 'Mock Exam 02', badge: 'INTERMEDIATE', badgeClass: 'badge-intermediate', icon: '📄', meta: ['120 mins', '100 questions', 'Focus: IP Connectivity'] },
  { id: 'mock-03', title: 'Mock Exam 03', badge: 'HARD', badgeClass: 'badge-hard', icon: '🛡️', meta: ['120 mins', '100 questions', 'Focus: Security Fundamentals'] },
];

// ─── Component ────────────────────────────────────────────────
const TestingCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'mock'
  const [expandedModule, setExpandedModule] = useState('m1');

  const handleStartExam = (examId) => {
    navigate(`/exam/take/${examId}`);
  };

  return (
    <div className="tc-page">
      <div className="tc-container">

        {/* Breadcrumb */}
        <div className="tc-breadcrumb">Academy &rsaquo; <span>Testing Center</span></div>

        {/* Hero */}
        <div className="tc-hero">
          <div>
            <h1 className="tc-hero-title">Trung tâm Kiểm tra &amp; Đánh giá</h1>
            <p className="tc-hero-desc">Phòng lab mô phỏng kỳ thi CCNA chuẩn quốc tế với hệ thống đánh giá chi tiết.</p>
          </div>
          <div className="tc-rank-badge">
            <span className="tc-rank-badge__label">Global Rank</span>
            <span className="tc-rank-badge__value">#1,240</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tc-tabs">
          <button
            className={`tc-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            Luyện tập theo chương
          </button>
          <button
            className={`tc-tab ${activeTab === 'mock' ? 'active' : ''}`}
            onClick={() => setActiveTab('mock')}
          >
            Thi thử CCNA
          </button>
        </div>

        {/* ── Tab 1: Practice by Chapter ── */}
        {activeTab === 'practice' && (
          <div className="tc-module-list">
            {MODULES.map((mod) => (
              <div key={mod.id} className="tc-module-card">
                <div className="tc-module-header" onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="tc-module-icon" style={{ background: mod.bg, color: mod.color }}>
                      {mod.locked ? '🔒' : mod.icon}
                    </div>
                    <div className="tc-module-info">
                      <h3>{mod.title}</h3>
                      <span>{mod.meta}</span>
                    </div>
                  </div>
                  <div className="tc-module-meta">
                    <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
                      {expandedModule === mod.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {expandedModule === mod.id && !mod.locked && mod.quizzes.length > 0 && (
                  <div className="tc-quiz-list">
                    {mod.quizzes.map((quiz) => (
                      <div key={quiz.id} className="tc-quiz-row">
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div className="tc-quiz-icon">{quiz.code}</div>
                          <div className="tc-quiz-info">
                            <h4>{quiz.label}</h4>
                            <span>{quiz.info}</span>
                          </div>
                        </div>
                        {quiz.score ? (
                          <div className="tc-quiz-score">
                            <span>{quiz.scoreLabel}</span>
                            <strong>{quiz.score}</strong>
                          </div>
                        ) : (
                          <div className="tc-quiz-score">
                            <span>{quiz.scoreLabel}</span>
                            <strong style={{ color: '#94a3b8' }}>{quiz.scoreSub}</strong>
                          </div>
                        )}
                        <button className="tc-btn-start" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} onClick={() => handleStartExam(quiz.id)}>
                          Làm bài
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Tab 2: Mock CCNA Exams ── */}
        {activeTab === 'mock' && (
          <div className="tc-mock-grid">
            {MOCK_EXAMS.map((exam) => (
              <div key={exam.id} className="tc-mock-card">
                <span className={`tc-mock-card__badge ${exam.badgeClass}`}>{exam.badge}</span>
                <div className="tc-mock-card__icon">{exam.icon}</div>
                <h3>{exam.title}</h3>
                <ul className="tc-mock-card__meta">
                  {exam.meta.map((m, i) => (
                    <li key={i}>
                      <span>⏱</span>{m}
                    </li>
                  ))}
                </ul>
                <div className="tc-mock-card__actions">
                  <button className="tc-btn-start" onClick={() => handleStartExam(exam.id)}>
                    Bắt đầu thi
                  </button>
                  <button className="tc-btn-history">XEM LẠI LỊCH SỬ THI</button>
                </div>
              </div>
            ))}

            {/* Coming Soon Card */}
            <div className="tc-soon-card">
              <span style={{ fontSize: '2rem', color: '#94a3b8' }}>⊕</span>
              <h4>More exams coming soon</h4>
              <p>We update our question bank every 2 weeks to match current CCNA standards.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TestingCenter;
