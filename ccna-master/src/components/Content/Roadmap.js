import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Lock,
  ArrowRight,
  Play,
  Loader2,
  AlertCircle,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/Api.js';

// Màu gradient cho từng khóa học
const COURSE_GRADIENTS = {
  ITN:  { gradient: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)', light: '#eff6ff', text: '#1d4ed8' },
  SRWE: { gradient: 'linear-gradient(135deg, #6d28d9, #7c3aed)', light: '#f5f3ff', text: '#6d28d9' },
  ENSA: { gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)', light: '#fdf4ff', text: '#7c3aed' },
};

const DEFAULT_GRADIENT = { gradient: 'linear-gradient(135deg, #2563eb, #60a5fa)', light: '#eff6ff', text: '#2563eb' };

export const Roadmap = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        setError('Không thể tải dữ liệu lộ trình.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}?from=roadmap`);
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="spin" color="#2563eb" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <p style={{ color: '#64748b' }}>Đang tải lộ trình...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', background: 'var(--slate-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px',
            padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '1rem', letterSpacing: '0.5px',
          }}>
            <BookOpen size={13} /> LỘ TRÌNH HỌC TẬP
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem' }}>
            Lộ trình CCNA 200-301
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>
            Chinh phục chứng chỉ quốc tế với 3 khóa học chuyên sâu, từ nền tảng đến nâng cao.
          </p>
        </div>

        {/* Connection line between courses */}
        <div style={{ position: 'relative' }}>

          {courses.map((course, index) => {
            const colors = COURSE_GRADIENTS[course.code] || DEFAULT_GRADIENT;
            const isStarted = course.progress > 0;
            const isCompleted = course.progress === 100;
            const moduleCount = course.modules?.length || 0;
            const completedModules = course.modules?.filter(m => m.status === 'completed').length || 0;

            return (
              <div key={course.id} style={{ position: 'relative', marginBottom: index < courses.length - 1 ? '1.5rem' : 0 }}>

                {/* Connector arrow between cards */}
                {index < courses.length - 1 && (
                  <div style={{
                    position: 'absolute', bottom: '-1.5rem', left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '2px',
                  }}>
                    <div style={{ width: 2, height: 20, background: '#cbd5e1' }} />
                    <ChevronRight size={16} color="#94a3b8" style={{ transform: 'rotate(90deg)' }} />
                    <div style={{ width: 2, height: 6, background: '#cbd5e1' }} />
                  </div>
                )}

                {/* Course Card */}
                <div
                  id={`course-card-${course.id}`}
                  className="card"
                  style={{
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    border: '1.5px solid #e2e8f0',
                    transition: 'all 0.25s ease',
                    cursor: 'default',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Gradient top bar */}
                  <div style={{ height: 5, background: colors.gradient }} />

                  <div style={{ padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>

                    {/* Code icon */}
                    <div style={{
                      width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                      background: colors.gradient, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '0.85rem',
                      letterSpacing: '0.5px', boxShadow: `0 6px 18px ${colors.text}40`,
                    }}>
                      {course.code}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                          {course.title}
                        </h2>
                        {isCompleted && (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                            borderRadius: '9999px', background: '#dcfce7', color: '#15803d',
                          }}>✓ Hoàn thành</span>
                        )}
                        {isStarted && !isCompleted && (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                            borderRadius: '9999px', background: '#dbeafe', color: '#1d4ed8',
                          }}>Đang học</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.875rem', lineHeight: 1.5 }}>
                        {course.description}
                      </p>

                      {/* Module status indicators */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {course.modules?.map((mod) => (
                          <div key={mod.id} title={mod.title} style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: mod.status === 'completed' ? '#22c55e'
                              : mod.status === 'active' ? '#2563eb' : '#cbd5e1',
                          }} />
                        ))}
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.25rem' }}>
                          {completedModules}/{moduleCount} modules
                        </span>
                      </div>
                    </div>

                    {/* Progress + CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.875rem', minWidth: 160 }}>
                      {/* Progress */}
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                          <span>Tiến độ</span>
                          <span style={{ color: isCompleted ? '#16a34a' : colors.text }}>{course.progress}%</span>
                        </div>
                        <div style={{ background: '#e2e8f0', borderRadius: '9999px', height: 7, overflow: 'hidden' }}>
                          <div style={{
                            width: `${course.progress}%`,
                            height: '100%',
                            borderRadius: '9999px',
                            background: isCompleted ? '#22c55e' : colors.gradient,
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        id={`btn-course-${course.id}`}
                        onClick={() => handleViewCourse(course.id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.65rem 1.25rem', borderRadius: '0.75rem',
                          fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                          border: 'none', color: 'white', background: colors.gradient,
                          boxShadow: `0 4px 14px ${colors.text}35`,
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${colors.text}45`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 14px ${colors.text}35`; }}
                      >
                        {isCompleted ? (
                          <><CheckCircle size={15} /> Ôn tập</>
                        ) : isStarted ? (
                          <><Play size={14} fill="white" /> Tiếp tục</>
                        ) : (
                          <>Xem chi tiết <ArrowRight size={15} /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '2.5rem' }}>
          * Mỗi khóa học mở khi bạn hoàn thành khóa học trước đó.
        </p>

      </div>
    </div>
  );
};

export default Roadmap;
