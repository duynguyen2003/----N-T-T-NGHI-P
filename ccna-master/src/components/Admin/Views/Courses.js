import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, BookOpen } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const Courses = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', title: '', description: '', level: 'BEGINNER', status: 'DRAFT', orderIndex: 0, thumbnail: null });
  const [error, setError] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleCreateCourse = async () => {
    try {
      setError('');
      if (!formData.code || !formData.title) throw new Error("Vui lòng nhập mã và tên khóa học");
      
      const payload = new FormData();
      payload.append('code', formData.code);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('level', formData.level);
      payload.append('status', formData.status);
      payload.append('orderIndex', formData.orderIndex);
      if (formData.thumbnail) payload.append('thumbnail', formData.thumbnail);

      await adminApi.createCourse(token, payload);
      setIsModalOpen(false);
      setFormData({ code: '', title: '', description: '', level: 'BEGINNER', status: 'DRAFT', orderIndex: 0, thumbnail: null });
      fetchCourses();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khóa học này?")) {
      try { await adminApi.deleteCourse(token, id); fetchCourses(); }
      catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="users-wrapper">
      <div className="admin-table-header" style={{ padding: '0 0 20px 0', border: 'none' }}>
        <h3>Quản lý Khóa Học</h3>
        <div className="admin-table-actions">
          <button className="admin-btn-primary" onClick={() => { setError(''); setIsModalOpen(true); }}>
            <Plus size={18} /> Thêm Mới
          </button>
        </div>
      </div>

      <div className="admin-datatable-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khóa học</th>
              <th>Mô tả</th>
              <th>Độ khó</th>
              <th>Trạng thái</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải...</td></tr> : 
             courses.length > 0 ? courses.map(c => (
              <tr key={c.id}>
                <td><span className="admin-badge student">{c.code}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {c.thumbnailUrl ? 
                      <img src={`http://localhost:5000${c.thumbnailUrl}`} alt={c.title} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /> : 
                      <div style={{width: '40px', height: '40px', backgroundColor: 'var(--admin-border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px'}}><Image size={20} /></div>
                    }
                    {c.title}
                  </div>
                </td>
                <td>{c.description ? (c.description.length > 40 ? c.description.substring(0, 40) + '...' : c.description) : '—'}</td>
                <td>{c.level}</td>
                <td><span className={`admin-badge ${c.status === 'PUBLISHED' ? 'active' : 'inactive'}`}>{c.status}</span></td>
                <td>{c.orderIndex}</td>
                <td>
                  <button className="admin-action-btn" title="Quản lý nội dung" onClick={() => navigate(`/admin/courses/${c.id}`)} style={{ color: 'var(--admin-primary)' }}>
                    <BookOpen size={16} />
                  </button>
                  <button className="admin-action-btn delete" title="Xóa" onClick={() => handleDelete(c.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Chưa có khóa học nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal title="Thêm Khóa Học" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateCourse}>
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mã khóa học (code) *</label>
              <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: ITN, SRWE, ENSA" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Thứ tự hiển thị</label>
              <input type="number" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Tên khóa học *</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: Introduction to Networking" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mô tả</label>
            <textarea className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box', height: '80px', resize: 'vertical' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mức độ</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                <option value="BEGINNER">Cơ bản</option>
                <option value="INTERMEDIATE">Trung bình</option>
                <option value="ADVANCED">Nâng cao</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Trạng thái</label>
              <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Ảnh bìa (Thumbnail)</label>
            <input type="file" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} onChange={e => setFormData({...formData, thumbnail: e.target.files[0]})} accept="image/*" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default Courses;
