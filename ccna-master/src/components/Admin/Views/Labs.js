import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, FileCode2 } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const Labs = () => {
  const { token } = useContext(AuthContext);
  const [labs, setLabs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', difficulty: 'EASY', duration: '',
    guideContent: '', courseId: '', moduleId: '', filePka: null
  });
  const [error, setError] = useState('');

  useEffect(() => { fetchLabs(); fetchCourses(); }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getLabs(token, 1);
      setLabs(res.data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchCourses = async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (error) { console.error("Lỗi lấy danh sách khóa học", error); }
  };

  const handleCreateLab = async () => {
    try {
      setError('');
      if (!formData.title) throw new Error("Vui lòng nhập tên bài Lab");
      
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('difficulty', formData.difficulty);
      payload.append('duration', formData.duration);
      payload.append('guideContent', formData.guideContent);
      if (formData.courseId) payload.append('courseId', formData.courseId);
      if (formData.moduleId) payload.append('moduleId', formData.moduleId);
      if (formData.filePka) payload.append('filePka', formData.filePka);

      await adminApi.createLab(token, payload);
      setIsModalOpen(false);
      setFormData({ title: '', category: '', difficulty: 'EASY', duration: '', guideContent: '', courseId: '', moduleId: '', filePka: null });
      fetchLabs();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài Lab này?")) {
      try { await adminApi.deleteLab(token, id); fetchLabs(); }
      catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="users-wrapper">
      <div className="admin-table-header" style={{ padding: '0 0 20px 0', border: 'none' }}>
        <h3>Quản lý Bài Lab (.pkt)</h3>
        <div className="admin-table-actions">
          <button className="admin-btn-primary" onClick={() => { setError(''); setIsModalOpen(true); }}>
            <Plus size={18} /> Thêm Bài Lab
          </button>
        </div>
      </div>

      <div className="admin-datatable-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bài Lab</th>
              <th>Danh mục</th>
              <th>Độ khó</th>
              <th>Thời lượng</th>
              <th>Thuộc khóa học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải...</td></tr> : 
             labs.length > 0 ? labs.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{width: '40px', height: '40px', backgroundColor: 'rgba(42, 133, 255, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px'}}><FileCode2 size={20} /></div>
                    <div>
                      <div style={{fontWeight: 500}}>{l.title}</div>
                      {l.fileUrl && <div style={{fontSize: '12px', color: 'var(--admin-text-secondary)'}}>{l.fileUrl.split('/').pop()}</div>}
                    </div>
                  </div>
                </td>
                <td>{l.category || '—'}</td>
                <td><span className={`admin-badge ${l.difficulty === 'EASY' ? 'active' : l.difficulty === 'HARD' ? 'admin' : 'student'}`}>{l.difficulty}</span></td>
                <td>{l.duration || '—'}</td>
                <td>{l.course?.title || '—'}</td>
                <td>
                  <button className="admin-action-btn delete" title="Xóa" onClick={() => handleDelete(l.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Chưa có bài Lab nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal title="Thêm Bài Lab Mới" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateLab}>
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Tên bài Lab *</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Danh mục</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: Routing, Switching" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Độ khó</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                <option value="EASY">Dễ (EASY)</option>
                <option value="MEDIUM">Trung bình (MEDIUM)</option>
                <option value="HARD">Khó (HARD)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Thời lượng</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: 30 phút" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Thuộc khóa học</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                <option value="">— Không chọn —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Module ID (Tùy chọn)</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: m1" value={formData.moduleId} onChange={e => setFormData({...formData, moduleId: e.target.value})} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Hướng dẫn thực hành</label>
            <textarea className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box', height: '80px', resize: 'vertical' }} value={formData.guideContent} onChange={e => setFormData({...formData, guideContent: e.target.value})}></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>File mô phỏng (.pkt, .pka)</label>
            <input type="file" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} onChange={e => setFormData({...formData, filePka: e.target.files[0]})} accept=".pkt,.pka" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default Labs;
