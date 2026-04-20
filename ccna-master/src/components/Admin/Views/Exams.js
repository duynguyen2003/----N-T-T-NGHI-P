import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const SAMPLE_QUESTIONS = `[
  {
    "question": "Giao thức nào hoạt động ở tầng Transport?",
    "options": ["HTTP", "TCP", "IP", "ARP"],
    "correctAnswer": 1,
    "explanation": "TCP (Transmission Control Protocol) hoạt động ở tầng Transport trong mô hình OSI."
  }
]`;

const Exams = () => {
  const { token } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', examCode: '', totalQuestions: 10, durationMinutes: 30,
    passingScore: 70, difficulty: '', courseId: '',
    questionsJson: SAMPLE_QUESTIONS
  });
  const [error, setError] = useState('');

  useEffect(() => { fetchExams(); fetchCourses(); }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExams(token, 1);
      setExams(res.data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchCourses = async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateExam = async () => {
    try {
      setError('');
      if (!formData.title) throw new Error("Vui lòng nhập tên bài thi");
      if (!formData.totalQuestions || !formData.durationMinutes) throw new Error("Vui lòng nhập số câu hỏi và thời gian");
      
      let parsedQuestions = [];
      try {
        parsedQuestions = JSON.parse(formData.questionsJson);
      } catch (e) {
        throw new Error("JSON câu hỏi không hợp lệ. Kiểm tra lại cú pháp.");
      }

      const payload = {
        title: formData.title,
        examCode: formData.examCode || null,
        totalQuestions: formData.totalQuestions,
        durationMinutes: formData.durationMinutes,
        passingScore: formData.passingScore,
        difficulty: formData.difficulty || null,
        courseId: formData.courseId || null,
        questions: parsedQuestions
      };

      await adminApi.createExam(token, payload);
      setIsModalOpen(false);
      setFormData({ ...formData, title: '', examCode: '' });
      fetchExams();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài thi này?")) {
      try { await adminApi.deleteExam(token, id); fetchExams(); }
      catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="users-wrapper">
      <div className="admin-table-header" style={{ padding: '0 0 20px 0', border: 'none' }}>
        <h3>Quản lý Bài Thi (Exams)</h3>
        <div className="admin-table-actions">
          <button className="admin-btn-primary" onClick={() => { setError(''); setIsModalOpen(true); }}>
            <Plus size={18} /> Thêm Bài Thi Mới
          </button>
        </div>
      </div>

      <div className="admin-datatable-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bài thi</th>
              <th>Mã đề</th>
              <th>Số câu</th>
              <th>Thời gian</th>
              <th>Điểm sàn</th>
              <th>Khóa học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="8" style={{textAlign: 'center'}}>Đang tải...</td></tr> : 
             exams.length > 0 ? exams.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="var(--admin-primary)"/> 
                    <div>
                      <div style={{ fontWeight: 500 }}>{e.title}</div>
                      {e.difficulty && <div style={{ fontSize: '11px', color: 'var(--admin-text-secondary)' }}>{e.difficulty}</div>}
                    </div>
                  </div>
                </td>
                <td>{e.examCode || '—'}</td>
                <td>{e.totalQuestions} câu</td>
                <td>{e.durationMinutes} phút</td>
                <td>{e.passingScore}%</td>
                <td>{e.course?.code || '—'}</td>
                <td>
                  <button className="admin-action-btn delete" title="Xóa" onClick={() => handleDelete(e.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={{textAlign: 'center'}}>Chưa có bài thi nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal title="Thêm Bài Thi Mới" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateExam}>
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Tên bài thi *</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: CCNA 200-301 Mock Exam 1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mã đề (examCode)</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: EX-001" value={formData.examCode} onChange={e => setFormData({...formData, examCode: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Số câu hỏi (totalQuestions) *</label>
              <input type="number" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.totalQuestions} onChange={e => setFormData({...formData, totalQuestions: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Thời gian (phút) *</label>
              <input type="number" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Điểm sàn (%)</label>
              <input type="number" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.passingScore} onChange={e => setFormData({...formData, passingScore: parseInt(e.target.value) || 70})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Độ khó</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                <option value="">— Không chọn —</option>
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Thuộc khóa học</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                <option value="">— Không chọn —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Dữ liệu câu hỏi (JSON)</label>
            <textarea 
              className="admin-search-input" 
              style={{ width: '100%', boxSizing: 'border-box', height: '180px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} 
              value={formData.questionsJson} 
              onChange={e => setFormData({...formData, questionsJson: e.target.value})}
            ></textarea>
            <small style={{ color: 'var(--admin-text-secondary)', display: 'block', marginTop: '4px' }}>
              Format: <code>{`[{ "question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..." }]`}</code>
              <br/>• <b>options</b>: Mảng chuỗi đáp án. • <b>correctAnswer</b>: Vị trí đáp án đúng (bắt đầu từ 0).
            </small>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default Exams;
