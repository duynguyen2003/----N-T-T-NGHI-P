import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight, BookOpen, FileText, Video, Tag, X } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', sectionNumber: '', contentHtml: '', videoUrl: '' });
  const [topicInput, setTopicInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch course info
      const coursesRes = await adminApi.getCourses(token, 1);
      const found = (coursesRes.data || []).find(c => c.id === courseId);
      setCourse(found || { id: courseId, title: courseId });

      // Fetch modules with nested lessons
      const modulesRes = await adminApi.getModules(token, courseId);
      setModules(modulesRes.data || []);

      // Fetch topics
      const topicsRes = await adminApi.getTopics(token, courseId);
      setTopics(topicsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // --- MODULE ACTIONS ---
  const handleCreateModule = async () => {
    try {
      setError('');
      if (!moduleForm.title) throw new Error('Vui lòng nhập tên chương');
      await adminApi.createModule(token, courseId, moduleForm);
      setIsModuleModalOpen(false);
      setModuleForm({ title: '', description: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Bạn có chắc muốn xóa chương này và tất cả bài học bên trong?')) {
      try {
        await adminApi.deleteModule(token, moduleId);
        fetchData();
      } catch (err) { alert(err.message); }
    }
  };

  // --- LESSON ACTIONS ---
  const openLessonModal = (moduleId) => {
    setActiveModuleId(moduleId);
    setLessonForm({ title: '', sectionNumber: '', contentHtml: '', videoUrl: '' });
    setError('');
    setIsLessonModalOpen(true);
  };

  const handleCreateLesson = async () => {
    try {
      setError('');
      if (!lessonForm.title) throw new Error('Vui lòng nhập tên bài học');
      await adminApi.createLesson(token, activeModuleId, lessonForm);
      setIsLessonModalOpen(false);
      setLessonForm({ title: '', sectionNumber: '', contentHtml: '', videoUrl: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài học này?')) {
      try {
        await adminApi.deleteLesson(token, lessonId);
        fetchData();
      } catch (err) { alert(err.message); }
    }
  };

  if (loading) {
    return <div className="users-wrapper" style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải...</div>;
  }

  return (
    <div className="users-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/admin/courses')} style={{ background: 'none', border: '1px solid var(--admin-border-color)', color: 'var(--admin-text-primary)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'var(--admin-transition)' }}>
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div>
          <h3 style={{ margin: 0 }}>{course?.title || 'Khóa học'}</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-text-secondary)', fontSize: '14px' }}>
            Mã: {course?.code || course?.id} • {modules.length} chương • {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)} bài học
          </p>
        </div>
      </div>

      {/* Topics Section */}
      <div style={{ marginBottom: '20px', padding: '16px 20px', backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-border-color)', borderRadius: 'var(--admin-border-radius)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Tag size={16} style={{ color: 'var(--admin-primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Chủ đề (Topics)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {topics.map(t => (
            <span key={t.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(42,133,255,0.1)', color: 'var(--admin-primary)', fontSize: '13px' }}>
              {t.title}
              <button onClick={() => { if (window.confirm('Xóa chủ đề này?')) adminApi.deleteTopic(token, t.id).then(fetchData); }} style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', padding: '0 2px', display: 'flex' }}><X size={12} /></button>
            </span>
          ))}
          {topics.length === 0 && <span style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>Chưa có chủ đề</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input className="admin-search-input" style={{ flex: 1 }} placeholder="Nhập chủ đề mới (VD: IPv4 & IPv6)" value={topicInput} onChange={e => setTopicInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && topicInput.trim()) { adminApi.createTopic(token, courseId, { title: topicInput.trim() }).then(() => { setTopicInput(''); fetchData(); }); } }} />
          <button className="admin-btn-primary" style={{ padding: '6px 12px' }} onClick={() => { if (topicInput.trim()) { adminApi.createTopic(token, courseId, { title: topicInput.trim() }).then(() => { setTopicInput(''); fetchData(); }); } }}>
            <Plus size={14} /> Thêm
          </button>
        </div>
      </div>

      {/* Add Module Button */}
      <div style={{ marginBottom: '20px' }}>
        <button className="admin-btn-primary" onClick={() => { setError(''); setIsModuleModalOpen(true); }}>
          <Plus size={18} /> Thêm Chương
        </button>
      </div>

      {/* Module List (Accordion) */}
      {modules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-border-color)', borderRadius: 'var(--admin-border-radius)', color: 'var(--admin-text-secondary)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p>Chưa có chương nào. Hãy bấm "Thêm Chương" để bắt đầu xây dựng nội dung.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {modules.map((mod, idx) => (
            <div key={mod.id} style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-border-color)', borderRadius: 'var(--admin-border-radius)', overflow: 'hidden' }}>
              {/* Module Header */}
              <div
                onClick={() => toggleModule(mod.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', userSelect: 'none', transition: 'var(--admin-transition)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {expandedModules[mod.id] ? <ChevronDown size={20} style={{ color: 'var(--admin-primary)' }} /> : <ChevronRight size={20} />}
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(42, 133, 255, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{mod.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                      {mod.lessons?.length || 0} bài học
                    </div>
                  </div>
                </div>
                <button
                  className="admin-action-btn delete"
                  title="Xóa chương"
                  onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id); }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Lessons (Expanded) */}
              {expandedModules[mod.id] && (
                <div style={{ borderTop: '1px solid var(--admin-border-color)', padding: '12px 20px 16px 64px' }}>
                  {mod.lessons && mod.lessons.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {mod.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border-color)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {lesson.videoUrl ? <Video size={16} style={{ color: 'var(--admin-primary)' }} /> : <FileText size={16} style={{ color: 'var(--admin-text-secondary)' }} />}
                            <span style={{ fontSize: '14px' }}>
                              {lesson.sectionNumber && <span style={{ color: 'var(--admin-text-secondary)', marginRight: '6px' }}>{lesson.sectionNumber}</span>}
                              {lesson.title}
                            </span>
                          </div>
                          <button className="admin-action-btn delete" title="Xóa bài" onClick={() => handleDeleteLesson(lesson.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: '4px 0 12px' }}>Chưa có bài học nào trong chương này.</p>
                  )}
                  <button
                    onClick={() => openLessonModal(mod.id)}
                    style={{ marginTop: '12px', background: 'none', border: '1px dashed var(--admin-border-color)', color: 'var(--admin-primary)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', transition: 'var(--admin-transition)' }}
                  >
                    <Plus size={14} /> Thêm Bài Học
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Thêm Chương */}
      <AdminModal title="Thêm Chương Mới" isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} onConfirm={handleCreateModule}>
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Tên chương *</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: Giới thiệu mạng máy tính" value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mô tả (Tùy chọn)</label>
            <textarea className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box', height: '80px', resize: 'vertical' }} value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })} />
          </div>
        </div>
      </AdminModal>

      {/* Modal: Thêm Bài Học */}
      <AdminModal title="Thêm Bài Học Mới" isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} onConfirm={handleCreateLesson}>
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Tên bài học *</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: Mạng là gì?" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Số mục (Section)</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="VD: 1.1.1" value={lessonForm.sectionNumber} onChange={e => setLessonForm({ ...lessonForm, sectionNumber: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Link Video (Tùy chọn)</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="https://youtube.com/..." value={lessonForm.videoUrl} onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Nội dung bài giảng (HTML)</label>
            <textarea className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box', height: '100px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Nội dung bài học...</p>" value={lessonForm.contentHtml} onChange={e => setLessonForm({ ...lessonForm, contentHtml: e.target.value })} />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default CourseDetail;
