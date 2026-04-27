import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../../../css/ExamFlow.css';

// ─── Mock Questions (giống TakeExam) ──────────────────────────
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
    explanation: 'Cú pháp đúng của lệnh ip route là: ip route [prefix] [mask] [next-hop/exit-interface]. Để định tuyến đến mạng 192.168.1.0/24 qua gateway 10.0.0.1, bạn sử dụng: ip route 192.168.1.0 255.255.255.0 10.0.0.1.',
    explanationBullets: [
      'AD của Static Route mặc định là 1.',
      'AD của OSPF là 110.',
      'AD của EIGRP là 90.',
      'AD của RIP là 120.',
    ],
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
    explanation: 'TCP (Transmission Control Protocol) là giao thức tầng Transport, connection-oriented, đảm bảo delivery thông qua 3-way handshake (SYN, SYN-ACK, ACK). UDP không connection-oriented, ICMP và ARP không phải tầng Transport.',
    explanationBullets: [
      'TCP: Connection-oriented, reliable, ordered delivery.',
      'UDP: Connectionless, low latency, no guarantee.',
      'ICMP: Network layer, dùng cho ping/traceroute.',
      'ARP: Link layer, resolve IP to MAC.',
    ],
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
    explanation: 'Khi MAC address chưa tồn tại trong CAM table, switch thực hiện "Unknown Unicast Flooding" — gửi frame ra tất cả port trừ ingress port. Đây là cơ chế học tự động của switch ở tầng 2.',
    explanationBullets: [
      'Switch học MAC của nguồn từ mọi frame vào.',
      'Nếu MAC đích không tìm thấy → Flood.',
      'Khi nhận reply → Học MAC đích vào bảng MAC.',
      'Bảng MAC có aging time mặc định 300 giây.',
    ],
    hasImage: false,
  },
];

// ─── Component ────────────────────────────────────────────────
const ReviewExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { state } = useLocation();

  const result = state || {
    score: 850,
    correct: 2,
    wrong: 1,
    total: 3,
    pass: true,
    timeUsed: '45:12',
    userAnswers: { 1: 'A', 2: 'C', 3: 'B' },
    questions: MOCK_QUESTIONS,
  };

  // Nếu state có userAnswers thật thì dùng, fallback thì dùng demo
  const userAnswers = (result.userAnswers && Object.keys(result.userAnswers).length)
    ? result.userAnswers
    : { 1: 'A', 2: 'C', 3: 'B' };

  const questions = MOCK_QUESTIONS;
  const [currentQ, setCurrentQ] = useState(0);
  const question = questions[currentQ];
  const userAnswer = userAnswers[question.id];
  const isCorrect = userAnswer === question.correct;

  // Xác định class cho mỗi option
  const getOptionClass = (optKey) => {
    let cls = 'take-exam__option';
    // Đáp án đúng luôn highlight xanh
    if (optKey === question.correct) return cls + ' take-exam__option--correct';
    // Đáp án sai mà user đã chọn → highlight đỏ
    if (optKey === userAnswer && !isCorrect) return cls + ' take-exam__option--wrong';
    return cls;
  };

  const answeredCorrect = questions.filter(q => userAnswers[q.id] === q.correct).length;
  const reviewPct = Math.round((currentQ + 1) / questions.length * 100);

  return (
    <div className="review-exam-page">

      {/* Không dùng top navbar tĩnh, các chức năng được chuyển dời vào sidebar */}

      {/* Body */}
      <div className="take-exam__body">

        {/* ── Question Card (Review Mode) ── */}
        <div className="take-exam__question-card">
          {/* Meta */}
          <div className="take-exam__question-meta">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span
                className="take-exam__q-tag"
                style={{ background: isCorrect ? '#dcfce7' : '#fee2e2', color: isCorrect ? '#166534' : '#991b1b' }}
              >
                {isCorrect ? '✓ CÂU HỎI ' : '✕ CÂU HỎI '}{currentQ + 1}: {isCorrect ? 'ĐÚNG' : 'SAI'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Lĩnh vực: {question.domain}</span>
            </div>
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

          {/* Options (READ ONLY mode - pointer-events: none) */}
          <div className="take-exam__options" style={{ pointerEvents: 'none' }}>
            {question.options.map((opt) => (
              <div key={opt.key} className={getOptionClass(opt.key)}>
                <span className="take-exam__option-badge">{opt.key}</span>
                <span className="take-exam__option-text" style={opt.isCode ? { fontFamily: 'monospace', fontSize: '0.88rem' } : {}}>
                  {opt.text}
                  {opt.key === question.correct && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>← Đáp án đúng</span>
                  )}
                  {opt.key === userAnswer && !isCorrect && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>← Lựa chọn của bạn (Sai)</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* ── Explanation Callout ── */}
          <div className="review-exam__explanation">
            <div className="review-exam__explanation-title">
              <span>💡</span> Giải thích chi tiết
            </div>
            <div className="review-exam__explanation-body">
              <p style={{ margin: '0 0 0.75rem' }}>{question.explanation}</p>
              {question.explanationBullets && (
                <ul>
                  {question.explanationBullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="take-exam__nav">
            <button
              className="btn btn-prev"
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(q => q - 1)}
            >
              ← Câu trước
            </button>
            <span className="take-exam__nav-info">CÂU {currentQ + 1} TRÊN {questions.length}</span>
            <button
              className="btn btn-next"
              disabled={currentQ === questions.length - 1}
              onClick={() => setCurrentQ(q => q + 1)}
            >
              Câu tiếp theo →
            </button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="take-exam__sidebar">
          {/* Nút Quay lại và Thống kê */}
          <div className="take-exam__sidebar-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.5rem',
                  padding: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', width: '100%', color: '#1e293b'
                }}
                onClick={() => navigate(`/exam/result/${examId}`, { state: result })}
             >
                ← Quay lại trang kết quả
             </button>
             <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
               <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Chế độ xem lại bài</div>
               <div style={{ fontSize: '1.2rem', fontWeight: 700, color: result.pass ? '#16a34a' : '#dc2626' }}>
                 Điểm: {result.score}/1000
               </div>
               <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.3rem' }}>{answeredCorrect} / {questions.length} câu đúng</div>
             </div>
             
             {/* Thanh tiến độ xem lại */}
             <div style={{ marginTop: '0.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Tiến độ: {reviewPct}%</span>
                    <span>{currentQ + 1}/{questions.length}</span>
                 </div>
                 <div className="take-exam__progress-bar" style={{ height: '6px', background: '#e2e8f0' }}>
                   <div className="take-exam__progress-fill" style={{ width: `${reviewPct}%`, background: '#2563eb' }} />
                 </div>
             </div>
          </div>

          {/* Question Map */}
          <div className="take-exam__sidebar-card">
            <div className="take-exam__sidebar-title">
              <span>Bản đồ câu hỏi</span>
            </div>
            <div className="take-exam__q-grid">
              {questions.map((q, index) => {
                const ua = userAnswers[q.id];
                const isRightAnswer = ua === q.correct;
                let bg = '#f1f5f9', color = '#64748b', border = 'none';
                if (index === currentQ) { bg = 'white'; color = '#2563eb'; border = '2px solid #2563eb'; }
                else if (!ua) { bg = '#f1f5f9'; color = '#94a3b8'; }
                else if (isRightAnswer) { bg = '#dcfce7'; color = '#16a34a'; }
                else { bg = '#fee2e2'; color = '#dc2626'; }
                return (
                  <button
                    key={index}
                    className="take-exam__q-dot"
                    style={{ background: bg, color, border }}
                    onClick={() => setCurrentQ(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="take-exam__legend">
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#dcfce7', border: '1px solid #16a34a' }}></div>
                <span>Đáp án đúng</span>
              </div>
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#fee2e2', border: '1px solid #dc2626' }}></div>
                <span>Đáp án sai</span>
              </div>
              <div className="take-exam__legend-item">
                <div className="take-exam__legend-dot" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}></div>
                <span>Chưa xem lại</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExam;
