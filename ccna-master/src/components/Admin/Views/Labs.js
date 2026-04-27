import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, FileCode2 } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import AdminPagination from '../Components/AdminPagination';
import CustomSelect from '../Components/CustomSelect';
import '../../../css/Admin/AdminViews.css';

const Labs = () => {
  const { token } = useContext(AuthContext);
  const [labs, setLabs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', difficulty: 'EASY', duration: '',
    guideContent: '', objective: '', courseId: '', moduleId: '', 
    filePka: null, thumbnailImg: null, topologyImg: null,
    steps: [{ title: '', commands: '', note: '' }]
  });
  const [previews, setPreviews] = useState({ thumbnail: null, topology: null });
  const [error, setError] = useState('');

  const fetchLabs = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await adminApi.getLabs(token, page);
      setLabs(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
        setTotalItems(res.pagination.total || 0);
        setCurrentPage(res.pagination.page || 1);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLabs(currentPage); fetchCourses(); }, [currentPage]);

  // Fetch modules when courseId changes
  useEffect(() => {
    const fetchModules = async () => {
      if (!formData.courseId) {
        setCourseModules([]);
        return;
      }
      try {
        setLoadingModules(true);
        const res = await adminApi.getModules(token, formData.courseId);
        setCourseModules(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách chương", err);
        setCourseModules([]);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchModules();
  }, [formData.courseId, token]);

  const fetchCourses = async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (error) { console.error("Lỗi lấy danh sách khóa học", error); }
  };

  const handleAddStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, { title: '', commands: '', note: '' }] });
  };

  const handleRemoveStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index][field] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, [field]: file });

    if (field === 'thumbnailImg' || field === 'topologyImg') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field === 'thumbnailImg' ? 'thumbnail' : 'topology']: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('difficulty', formData.difficulty);
      payload.append('duration', formData.duration);
      payload.append('guideContent', formData.guideContent);
      payload.append('objective', formData.objective);
      
      if (formData.courseId) payload.append('courseId', formData.courseId);
      if (formData.moduleId) payload.append('moduleId', formData.moduleId);
      
      if (formData.filePka) payload.append('filePka', formData.filePka);
      if (formData.thumbnailImg) payload.append('thumbnailImg', formData.thumbnailImg);
      if (formData.topologyImg) payload.append('topologyImg', formData.topologyImg);

      // Convert steps to the format expected by student UI (commands as array)
      const formattedSteps = formData.steps.map(s => ({
        ...s,
        commands: s.commands.split('\n').filter(c => c.trim() !== '')
      }));
      payload.append('steps', JSON.stringify(formattedSteps));

      await adminApi.createLab(token, payload);
      setIsModalOpen(false);
      setFormData({ 
        title: '', category: '', difficulty: 'EASY', duration: '', 
        guideContent: '', objective: '', courseId: '', moduleId: '', 
        filePka: null, thumbnailImg: null, topologyImg: null,
        steps: [{ title: '', commands: '', note: '' }] 
      });
      setPreviews({ thumbnail: null, topology: null });
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

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Bài Lab Mới"
        onConfirm={handleSubmit}
        size="large"
      >
        <div className="acm-modal-form">
          {error && <div className="acm-form-error">{error}</div>}
          
          <div className="acm-modal-top-row">
            <div className="acm-modal-left-col">
              <div className="acm-field">
                <span>Tên bài Lab *</span>
                <input className="acm-input" placeholder="Nhập tên bài Lab..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="acm-modal-fields-row">
                <div className="acm-field">
                  <span>Danh mục</span>
                  <input className="acm-input" placeholder="VD: Routing, Switching" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="acm-field">
                  <span>Độ khó</span>
                  <CustomSelect
                    value={formData.difficulty}
                    onChange={val => setFormData({...formData, difficulty: val})}
                    options={[
                      { value: 'EASY', label: 'Dễ (EASY)' },
                      { value: 'MEDIUM', label: 'Trung bình (MEDIUM)' },
                      { value: 'HARD', label: 'Khó (HARD)' }
                    ]}
                  />
                </div>
              </div>

              <div className="acm-modal-fields-row">
                <div className="acm-field">
                  <span>Thời lượng</span>
                  <input className="acm-input" placeholder="VD: 30 phút" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                </div>
                <div className="acm-field">
                  <span>File Packet Tracer (.pka)</span>
                  <input type="file" onChange={e => handleFileChange(e, 'filePka')} />
                </div>
              </div>
            </div>

            <div className="acm-modal-right-col">
              <div className="acm-modal-fields-row">
                <div className="acm-thumbnail-upload">
                  <span className="acm-upload-label">Ảnh đại diện</span>
                  <div className="acm-upload-dropzone" style={{ minHeight: '120px' }} onClick={() => document.getElementById('lab-thumb').click()}>
                    {previews.thumbnail ? <img src={previews.thumbnail} className="acm-upload-preview" /> : <Plus size={24} className="acm-upload-icon" />}
                    <input id="lab-thumb" type="file" hidden onChange={e => handleFileChange(e, 'thumbnailImg')} />
                  </div>
                </div>
                <div className="acm-thumbnail-upload">
                  <span className="acm-upload-label">Ảnh sơ đồ mạng</span>
                  <div className="acm-upload-dropzone" style={{ minHeight: '120px' }} onClick={() => document.getElementById('lab-topo').click()}>
                    {previews.topology ? <img src={previews.topology} className="acm-upload-preview" /> : <Plus size={24} className="acm-upload-icon" />}
                    <input id="lab-topo" type="file" hidden onChange={e => handleFileChange(e, 'topologyImg')} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="acm-modal-fields-row">
            <div className="acm-field">
              <span>Thuộc khóa học</span>
              <CustomSelect
                value={formData.courseId}
                onChange={val => setFormData({...formData, courseId: val, moduleId: ''})}
                options={[
                  { value: '', label: '— Không chọn —' },
                  ...courses.map(c => ({ value: c.id, label: `${c.code} — ${c.title}` }))
                ]}
              />
            </div>
            <div className="acm-field">
              <span>Module {loadingModules && <span style={{fontSize: '10px', fontWeight: 400}}>(Đang tải...)</span>}</span>
              <CustomSelect
                value={formData.moduleId}
                onChange={val => setFormData({...formData, moduleId: val})}
                options={[
                  { value: '', label: '— Không chọn —' },
                  ...courseModules.map(m => ({ value: m.id, label: `${m.title}` }))
                ]}
                placeholder={formData.courseId ? "Chọn chương..." : "Chọn khóa học trước"}
              />
            </div>
          </div>

          <div className="acm-field">
            <span>Mục tiêu bài tập</span>
            <textarea className="acm-textarea" rows="2" placeholder="Nêu các mục tiêu chính của bài thực hành..." value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} />
          </div>

          <div className="acm-field">
            <span>Các bước hướng dẫn (Step-by-step)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {formData.steps.map((step, index) => (
                <div key={index} style={{ padding: '15px', background: '#fff', borderRadius: '10px', border: '1px solid #cbd5e1', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>Bước {index + 1}</strong>
                    {formData.steps.length > 1 && (
                      <button type="button" onClick={() => handleRemoveStep(index)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      className="acm-input" 
                      placeholder="Tiêu đề bước (VD: Cấu hình IP cho Router)" 
                      value={step.title} 
                      onChange={e => handleStepChange(index, 'title', e.target.value)} 
                    />
                    <textarea 
                      className="acm-textarea" 
                      rows="3" 
                      placeholder="Danh sách lệnh (Mỗi lệnh một dòng)" 
                      value={step.commands} 
                      onChange={e => handleStepChange(index, 'commands', e.target.value)}
                      style={{ fontFamily: 'monospace' }}
                    />
                    <input 
                      className="acm-input" 
                      placeholder="Ghi chú thêm (Nếu có)" 
                      value={step.note} 
                      onChange={e => handleStepChange(index, 'note', e.target.value)} 
                    />
                  </div>
                </div>
              ))}
              <button type="button" className="acm-secondary-btn" onClick={handleAddStep} style={{ width: 'fit-content', alignSelf: 'center' }}>
                <Plus size={16} /> Thêm bước mới
              </button>
            </div>
          </div>

          <div className="acm-field">
            <span>Hướng dẫn/Mô tả chung</span>
            <textarea className="acm-textarea" rows="3" placeholder="Nhập nội dung hướng dẫn hoặc mô tả thêm..." value={formData.guideContent} onChange={e => setFormData({...formData, guideContent: e.target.value})} />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default Labs;
