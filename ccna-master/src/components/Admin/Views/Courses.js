import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, BookOpen, Search, Loader2, GraduationCap, ListChecks, Pencil } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const initialCourseForm = {
  code: '',
  title: '',
  description: '',
  level: 'BEGINNER',
  status: 'DRAFT',
  orderIndex: 0,
  thumbnail: null
};

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (String(url).startsWith('http://') || String(url).startsWith('https://')) {
    return url;
  }
  return `http://localhost:5000${url}`;
};

const Courses = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(initialCourseForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khóa học.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return courses;

    return courses.filter((course) => {
      const title = String(course.title || '').toLowerCase();
      const code = String(course.code || '').toLowerCase();
      const level = String(course.level || '').toLowerCase();
      return title.includes(keyword) || code.includes(keyword) || level.includes(keyword);
    });
  }, [courses, searchValue]);

  const publishedCount = useMemo(
    () => courses.filter((course) => course.status === 'PUBLISHED').length,
    [courses]
  );

  const openCreateModal = () => {
    setError('');
    setEditingCourse(null);
    setFormData(initialCourseForm);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setError('');
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      title: course.title || '',
      description: course.description || '',
      level: course.level || 'BEGINNER',
      status: course.status || 'DRAFT',
      orderIndex: course.orderIndex ?? 0,
      thumbnail: null
    });
    setIsModalOpen(true);
  };

  const handleSubmitCourse = async () => {
    try {
      setError('');

      if (!formData.code.trim() || !formData.title.trim()) {
        throw new Error('Vui lòng nhập đầy đủ mã và tên khóa học.');
      }

      setIsSubmitting(true);

      const payload = new FormData();
      payload.append('code', formData.code.trim());
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description);
      payload.append('level', formData.level);
      payload.append('status', formData.status);
      payload.append('orderIndex', String(formData.orderIndex || 0));
      if (formData.thumbnail) payload.append('thumbnail', formData.thumbnail);

      if (editingCourse) {
        await adminApi.updateCourse(token, editingCourse.id, payload);
      } else {
        await adminApi.createCourse(token, payload);
      }

      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData(initialCourseForm);
      await fetchCourses();
    } catch (err) {
      setError(err.message || 'Không thể lưu khóa học.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return;

    try {
      setDeletingId(id);
      await adminApi.deleteCourse(token, id);
      await fetchCourses();
    } catch (err) {
      setError(err.message || 'Không thể xóa khóa học.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="users-wrapper acm-page">
      <section className="acm-hero">
        <div className="acm-hero-main">
          <h2 className="acm-hero-title">Quản lý khóa học</h2>
          <p className="acm-hero-subtitle">Theo dõi danh sách khóa học và điều hướng đến khu vực quản lý chương, bài học.</p>
        </div>
        <button className="acm-primary-btn" onClick={openCreateModal}>
          <Plus size={16} />
          Thêm khóa học
        </button>
      </section>

      <section className="acm-stats-grid">
        <article className="acm-stat-card">
          <div>
            <p className="acm-stat-label">Tổng khóa học</p>
            <p className="acm-stat-value">{courses.length}</p>
          </div>
          <GraduationCap size={18} />
        </article>
        <article className="acm-stat-card">
          <div>
            <p className="acm-stat-label">Đang xuất bản</p>
            <p className="acm-stat-value">{publishedCount}</p>
          </div>
          <ListChecks size={18} />
        </article>
      </section>

      <section className="acm-course-card">
        <div className="acm-course-toolbar">
          <label className="acm-search">
            <Search size={15} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm theo mã, tên hoặc mức độ"
            />
          </label>
        </div>

        {error ? <p className="acm-form-error">{error}</p> : null}

        {loading ? (
          <div className="acm-loading-state">
            <Loader2 size={18} className="acm-spin" /> Đang tải dữ liệu...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="acm-empty-state">
            <BookOpen size={40} />
            <p>Không có khóa học phù hợp.</p>
          </div>
        ) : (
          <div className="acm-course-table-wrap">
            <table className="acm-course-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khóa học</th>
                  <th>Mô tả</th>
                  <th>Mức độ</th>
                  <th>Trạng thái</th>
                  <th>Thứ tự</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <span className="acm-code-pill">{course.code}</span>
                    </td>
                    <td>
                      <div className="acm-course-name-cell">
                        <span className="acm-thumbnail">
                          {course.thumbnailUrl ? (
                            <img src={resolveMediaUrl(course.thumbnailUrl)} alt={course.title} />
                          ) : (
                            <Image size={16} />
                          )}
                        </span>
                        <span>{course.title}</span>
                      </div>
                    </td>
                    <td className="acm-cell-muted">
                      {course.description
                        ? course.description.length > 70
                          ? `${course.description.slice(0, 70)}...`
                          : course.description
                        : '—'}
                    </td>
                    <td>
                      <span className="acm-level-pill">{course.level || '—'}</span>
                    </td>
                    <td>
                      <span className={`acm-status-badge ${course.status === 'PUBLISHED' ? 'published' : 'draft'}`}>
                        {course.status || 'DRAFT'}
                      </span>
                    </td>
                    <td>{course.orderIndex ?? 0}</td>
                    <td>
                      <div className="acm-row-actions">
                        <button
                          className="acm-action-btn"
                          title="Sửa khóa học"
                          onClick={() => openEditModal(course)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="acm-action-btn"
                          title="Quản lý nội dung"
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                        >
                          <BookOpen size={15} />
                        </button>
                        <button
                          className="acm-action-btn danger"
                          title="Xóa"
                          disabled={deletingId === course.id}
                          onClick={() => handleDelete(course.id)}
                        >
                          {deletingId === course.id ? <Loader2 size={15} className="acm-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminModal
        title={editingCourse ? 'Cập nhật khóa học' : 'Thêm khóa học'}
        description="Bạn có thể xem lại thông tin đã tạo và cập nhật trực tiếp tại đây."
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onConfirm={handleSubmitCourse}
        confirmText={isSubmitting ? 'Đang lưu...' : editingCourse ? 'Lưu thay đổi' : 'Tạo khóa học'}
      >
        {error ? <p className="acm-form-error">{error}</p> : null}
        <div className="acm-form-grid two-cols">
          <label className="acm-field">
            <span>Mã khóa học *</span>
            <input
              className="acm-input"
              placeholder="VD: ITN"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </label>

          <label className="acm-field">
            <span>Thứ tự hiển thị</span>
            <input
              type="number"
              className="acm-input"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value, 10) || 0 })}
            />
          </label>

          <label className="acm-field acm-full-row">
            <span>Tên khóa học *</span>
            <input
              className="acm-input"
              placeholder="VD: Introduction to Networking"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </label>

          <label className="acm-field acm-full-row">
            <span>Mô tả</span>
            <textarea
              className="acm-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </label>

          <label className="acm-field">
            <span>Mức độ</span>
            <select
              className="acm-input"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option value="BEGINNER">Cơ bản</option>
              <option value="INTERMEDIATE">Trung bình</option>
              <option value="ADVANCED">Nâng cao</option>
            </select>
          </label>

          <label className="acm-field">
            <span>Trạng thái</span>
            <select
              className="acm-input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="DRAFT">Bản nháp</option>
              <option value="PUBLISHED">Xuất bản</option>
            </select>
          </label>

          <label className="acm-field acm-full-row">
            <span>{editingCourse ? 'Đổi thumbnail (nếu cần)' : 'Thumbnail'}</span>
            <input
              type="file"
              className="acm-input"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
            />
          </label>
        </div>
      </AdminModal>
    </div>
  );
};

export default Courses;