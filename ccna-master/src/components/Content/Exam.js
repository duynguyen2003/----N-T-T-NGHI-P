// Exam.js
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, RotateCcw, Flag } from 'lucide-react';



const mockQuestions = [
   {
      id: 1,
      question: "Giao thức nào được sử dụng để tìm địa chỉ MAC từ một địa chỉ IP đã biết?",
      options: ["RARP", "ARP", "DNS", "DHCP"],
      correctAnswer: 1,
      explanation: "ARP (Address Resolution Protocol) được sử dụng để ánh xạ địa chỉ IP sang địa chỉ MAC."
   },
   {
      id: 2,
      question: "Lệnh nào dùng để lưu cấu hình đang chạy vào NVRAM trên Router Cisco?",
      options: ["copy running-config startup-config", "save config", "copy startup-config running-config", "write memory flash"],
      correctAnswer: 0,
      explanation: "Lệnh chuẩn là 'copy running-config startup-config'."
   },
   {
      id: 3,
      question: "Địa chỉ IP nào sau đây là địa chỉ Private Class B?",
      options: ["10.0.0.1", "172.16.0.1", "192.168.1.1", "172.32.0.1"],
      correctAnswer: 1,
      explanation: "Dải Private Class B là từ 172.16.0.0 đến 172.31.255.255."
   },
   {
      id: 4,
      question: "Switch hoạt động ở tầng nào của mô hình OSI?",
      options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
      correctAnswer: 1,
      explanation: "Switch (Layer 2) hoạt động ở tầng Data Link."
   },
   {
      id: 5,
      question: "Cổng mặc định cho giao thức HTTP là gì?",
      options: ["21", "23", "80", "443"],
      correctAnswer: 2,
      explanation: "HTTP chạy trên cổng 80, HTTPS chạy trên cổng 443."
   }
];

export const Exam = () => {
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [selectedAnswers, setSelectedAnswers] = useState(new Array(mockQuestions.length).fill(null));
   const [showResult, setShowResult] = useState(false);
   const [timeLeft, setTimeLeft] = useState(15 * 60);

   useEffect(() => {
      if (showResult) return;
      const timer = setInterval(() => {
         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
   }, [showResult]);

   const handleSelect = (optionIndex) => {
      if (showResult) return;
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = optionIndex;
      setSelectedAnswers(newAnswers);
   };

   const calculateScore = () => {
      let score = 0;
      selectedAnswers.forEach((ans, idx) => {
         if (ans === mockQuestions[idx].correctAnswer) score++;
      });
      return score;
   };

   const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
   };

   const resetExam = () => {
      setCurrentQuestion(0);
      setSelectedAnswers(new Array(mockQuestions.length).fill(null));
      setShowResult(false);
      setTimeLeft(15 * 60);
   };

   // --- MÀN HÌNH KẾT QUẢ ---
   if (showResult) {
      const score = calculateScore();
      const percentage = Math.round((score / mockQuestions.length) * 100);
      const isPassed = percentage >= 70;

      return (
         <div className="exam-page">
            <div className="result-card">
               <div className="result-header">
                  <h2>Kết quả bài thi</h2>
                  <p>Đề thi thử CCNA - Mã đề 001</p>
               </div>

               <div style={{ padding: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                     <div className={`score-circle ${isPassed ? 'score-pass' : 'score-fail'}`}>
                        {percentage}%
                     </div>
                     <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isPassed ? 'Đạt yêu cầu' : 'Chưa đạt'}</h3>
                     <p>Bạn đã trả lời đúng <b>{score}/{mockQuestions.length}</b> câu hỏi.</p>
                  </div>

                  <div className="review-list">
                     <h3>Chi tiết đáp án:</h3>
                     {mockQuestions.map((q, idx) => (
                        <div key={q.id} className={`review-item ${selectedAnswers[idx] === q.correctAnswer ? 'correct' : 'wrong'}`}>
                           <div style={{ display: 'flex', gap: '1rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#64748b' }}>Câu {idx + 1}:</span>
                              <div>
                                 <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{q.question}</p>
                                 <div style={{ fontSize: '0.9rem' }}>
                                    <p style={{ color: selectedAnswers[idx] === q.correctAnswer ? '#16a34a' : '#dc2626' }}>
                                       Bạn chọn: {selectedAnswers[idx] !== null ? q.options[selectedAnswers[idx]] : 'Không trả lời'}
                                    </p>
                                    {selectedAnswers[idx] !== q.correctAnswer && (
                                       <p style={{ color: '#16a34a', fontWeight: 'bold' }}>Đáp án đúng: {q.options[q.correctAnswer]}</p>
                                    )}
                                 </div>
                                 <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>
                                    💡 {q.explanation}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                     <button onClick={resetExam} className="btn btn-next">
                        <RotateCcw size={20} /> Làm lại bài thi
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // --- MÀN HÌNH LÀM BÀI ---
   return (
      <div className="exam-page">
         <div className="container">
            {/* Exam Header */}
            <div className="exam-header">
               <div className="exam-title">
                  <h1>Đề thi thử CCNA Mock Exam 01</h1>
                  <div className="exam-info">
                     <span style={{ marginRight: '1rem' }}>Câu hỏi: {mockQuestions.length}</span>
                     <span>Mức độ: Trung bình</span>
                  </div>
               </div>
               <div className={`timer-box ${timeLeft < 60 ? 'warning' : ''}`}>
                  <Timer size={20} />
                  {formatTime(timeLeft)}
               </div>
            </div>

            <div className="exam-layout">
               {/* Cột trái: Câu hỏi */}
               <div>
                  <div className="question-card">
                     <div className="q-header">
                        <span className="q-tag">Câu hỏi {currentQuestion + 1}</span>
                        <Flag size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
                     </div>

                     <h3 className="q-content">
                        {mockQuestions[currentQuestion].question}
                     </h3>

                     <div className="options-list">
                        {mockQuestions[currentQuestion].options.map((option, idx) => (
                           <label
                              key={idx}
                              className={`option-label ${selectedAnswers[currentQuestion] === idx ? 'selected' : ''}`}
                           >
                              <input
                                 type="radio"
                                 name="answer"
                                 className="hidden"
                                 onChange={() => handleSelect(idx)}
                                 checked={selectedAnswers[currentQuestion] === idx}
                                 style={{ display: 'none' }} // Ẩn radio mặc định
                              />
                              {/* Custom Radio Circle */}
                              <div className="radio-circle">
                                 {selectedAnswers[currentQuestion] === idx && <div className="dot"></div>}
                              </div>

                              <span style={{ fontWeight: selectedAnswers[currentQuestion] === idx ? '600' : '400' }}>
                                 {option}
                              </span>
                           </label>
                        ))}
                     </div>

                     <div className="nav-buttons">
                        <button
                           disabled={currentQuestion === 0}
                           onClick={() => setCurrentQuestion(prev => prev - 1)}
                           className="btn btn-prev"
                        >
                           Câu trước
                        </button>

                        {currentQuestion < mockQuestions.length - 1 ? (
                           <button
                              onClick={() => setCurrentQuestion(prev => prev + 1)}
                              className="btn btn-next"
                           >
                              Câu sau
                           </button>
                        ) : (
                           <button
                              onClick={() => setShowResult(true)}
                              className="btn btn-submit"
                           >
                              Nộp bài thi <CheckCircle size={18} />
                           </button>
                        )}
                     </div>
                  </div>
               </div>

               {/* Cột phải: Sidebar điều hướng */}
               <div>
                  <div className="sidebar-card">
                     <h4 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        Danh sách câu hỏi
                     </h4>

                     <div className="question-grid">
                        {mockQuestions.map((_, idx) => (
                           <button
                              key={idx}
                              onClick={() => setCurrentQuestion(idx)}
                              className={`grid-item 
                              ${currentQuestion === idx ? 'active' : ''} 
                              ${selectedAnswers[idx] !== null && currentQuestion !== idx ? 'answered' : ''}
                           `}
                           >
                              {idx + 1}
                           </button>
                        ))}
                     </div>

                     <div className="legend">
                        <div className="legend-item">
                           <div className="box-sample box-answered"></div> Đã trả lời
                        </div>
                        <div className="legend-item">
                           <div className="box-sample box-unanswered"></div> Chưa trả lời
                        </div>
                        <div className="legend-item">
                           <div className="box-sample box-active"></div> Đang xem
                        </div>
                     </div>

                     <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                        <button
                           className="btn"
                           style={{ width: '100%', justifyContent: 'center', background: '#fef2f2', color: '#dc2626', fontSize: '0.9rem' }}
                        >
                           Kết thúc sớm
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Exam;