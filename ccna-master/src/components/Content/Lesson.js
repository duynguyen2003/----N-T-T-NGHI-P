import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
   ChevronLeft, ChevronRight, Menu, FileText,
   AlertCircle, Download, CheckCircle, MessageSquare, Play, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/Api';

const MOBILE_BREAKPOINT = 1024;
const RESOURCE_BREAKPOINT = 1280;

const getViewportWidth = () => (
   typeof window === 'undefined' ? RESOURCE_BREAKPOINT : window.innerWidth
);

const extractIframeSrc = (value) => {
   const match = value?.match(/src=["']([^"']+)["']/i);
   return match ? match[1] : value;
};

const normalizeVideoUrl = (value) => {
   if (!value) return '';
   const trimmed = value.trim();
   // Nếu là iframe embed code thì lấy src ra
   if (trimmed.includes('<iframe')) {
      return extractIframeSrc(trimmed);
   }
   // Trả về link YouTube trực tiếp (youtu.be, youtube.com)
   return trimmed;
};

const defaultProgressState = () => ({
   played: 0,
   playedSeconds: 0,
   loaded: 0,
   loadedSeconds: 0,
   completed: false
});

const Lesson = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const courseId = searchParams.get('course');
   const { token } = useAuth();

   const [viewportWidth, setViewportWidth] = useState(getViewportWidth);
   const [leftOpen, setLeftOpen] = useState(() => getViewportWidth() >= MOBILE_BREAKPOINT);
   const [rightOpen, setRightOpen] = useState(() => getViewportWidth() >= RESOURCE_BREAKPOINT);
   
   const [course, setCourse] = useState(null);
   const [modules, setModules] = useState([]);
   const [activeModule, setActiveModule] = useState(null);
   const [lessons, setLessons] = useState([]);
   const [selectedLessonId, setSelectedLessonId] = useState(null);
   const [loading, setLoading] = useState(true);

   const [lessonProgress, setLessonProgress] = useState({});

   const isMobile = viewportWidth < MOBILE_BREAKPOINT;
   const isCompact = viewportWidth < RESOURCE_BREAKPOINT;

   useEffect(() => {
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      const initLesson = async () => {
         if (!courseId || !token) return;
         try {
            setLoading(true);
            // 1. Fetch Course & Modules
            const courses = await api.getCourses(token);
            const currentCourse = courses.find(c => c.id === courseId);
            setCourse(currentCourse);

            const courseModules = await api.getModulesByCourse(token, courseId);
            setModules(courseModules);

            if (courseModules.length > 0) {
               const firstModule = courseModules[0];
               setActiveModule(firstModule);
               
               // 2. Fetch Lessons for the first module
               const moduleLessons = await api.getLessonsByModule(token, firstModule.id);
               setLessons(moduleLessons);
               
               if (moduleLessons.length > 0) {
                  setSelectedLessonId(moduleLessons[0].id);
               }
            }
         } catch (error) {
            console.error("Error initializing lesson view:", error);
         } finally {
            setLoading(false);
         }
      };
      initLesson();
   }, [courseId, token]);

   const selectedLesson = useMemo(
      () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0],
      [lessons, selectedLessonId]
   );

   const completedCount = lessons.filter((lesson) => lessonProgress[lesson.id]?.completed).length;
   const progressPercent = lessons.length ? (completedCount / lessons.length) * 100 : 0;
   const showOverlay = (isMobile && leftOpen) || (isCompact && rightOpen);

   const updateLessonCompletion = (lessonId, completed) => {
      setLessons((currentLessons) =>
         currentLessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed } : lesson
         )
      );
   };

   const closePanels = () => {
      if (isMobile) {
         setLeftOpen(false);
      }
      if (isCompact) {
         setRightOpen(false);
      }
   };

   const handleSelectLesson = (lessonId) => {
      setSelectedLessonId(lessonId);
      if (isMobile) {
         setLeftOpen(false);
      }
   };

   const toggleLeftSidebar = () => {
      setLeftOpen((current) => {
         const next = !current;
         if (next && isCompact) {
            setRightOpen(false);
         }
         return next;
      });
   };

   const toggleRightSidebar = () => {
      setRightOpen((current) => {
         const next = !current;
         if (next && isMobile) {
            setLeftOpen(false);
         }
         return next;
      });
   };

   const handlePlay = (lessonId) => {
      const lesson = lessons.find((item) => item.id === lessonId);
      console.log('onPlay', { lessonId, videoUrl: lesson?.videoUrl });
   };

   const handlePause = (lessonId) => {
      console.log('onPause', {
         lessonId,
         playedSeconds: lessonProgress[lessonId]?.playedSeconds ?? 0
      });
   };

   const handleEnded = (lessonId) => {
      setLessonProgress((currentProgress) => ({
         ...currentProgress,
         [lessonId]: {
            ...currentProgress[lessonId],
            played: 1,
            completed: true
         }
      }));
      updateLessonCompletion(lessonId, true);
      console.log('onEnded', { lessonId, completed: true });
   };

   const handleProgress = (lessonId, state) => {
      const playedRatio = state.played || 0;
      const completed = playedRatio >= 0.95;

      setLessonProgress((currentProgress) => ({
         ...currentProgress,
         [lessonId]: {
            ...currentProgress[lessonId],
            ...state,
            completed
         }
      }));

      if (completed) {
         updateLessonCompletion(lessonId, true);
      }
   };

   // Logic điều hướng bài học
   const currentIndex = lessons.findIndex(l => l.id === selectedLessonId);
   const hasPrev = currentIndex > 0;
   const hasNext = currentIndex < lessons.length - 1;

   const currentProgress = lessonProgress[selectedLessonId]?.played || 0;
   const isNextDisabled = !hasNext || currentProgress < 0.7;

   const handleNext = () => {
      if (hasNext && !isNextDisabled) {
         const nextLesson = lessons[currentIndex + 1];
         handleSelectLesson(nextLesson.id);
      }
   };

   const handlePrev = () => {
      if (hasPrev) {
         const prevLesson = lessons[currentIndex - 1];
         handleSelectLesson(prevLesson.id);
      }
   };

   if (loading) {
      return <div className="lesson-loading">Đang tải nội dung bài học...</div>;
   }

   if (!selectedLesson) {
      return (
         <div className="lesson-error">
            <h2>Không tìm thấy bài học</h2>
            <button onClick={() => navigate('/roadmap')}>Quay lại Lộ trình</button>
         </div>
      );
   }

   return (
      <div className="lesson-layout">
         {showOverlay && (
            <button
               type="button"
               className="lesson-overlay"
               onClick={closePanels}
               aria-label="Close lesson panels"
            ></button>
         )}

         <div className="lesson-sidebar" style={{ display: leftOpen ? 'block' : 'none' }}>
            <div className="ls-header">
               <small className="ls-course-label">{course?.code} Course</small>
               <h3 className="ls-module-title">{activeModule?.title}</h3>
               <div className="ls-progress-bg">
                  <div
                     className="ls-progress-bar"
                     style={{ width: `${progressPercent}%` }}
                  ></div>
               </div>
            </div>

            <div className="ls-section-list">
               {lessons.map((lesson) => {
                  const isActive = lesson.id === selectedLessonId;
                  const isCompleted = lessonProgress[lesson.id]?.completed;

                  return (
                     <div key={lesson.id} className="ls-section-item">
                        <div className="ls-section-label">Section {lesson.sectionNumber || lesson.orderIndex}</div>
                        <button
                           type="button"
                           className={`ls-section-btn ${isActive ? 'active' : ''}`}
                           onClick={() => handleSelectLesson(lesson.id)}
                        >
                           <div className="ls-section-btn-icon">
                              {isCompleted ? <CheckCircle size={16} color="#22c55e" /> :
                                 isActive ? <Play size={16} fill="currentColor" /> :
                                    <div className="ls-section-btn-icon-empty"></div>}
                           </div>
                           <div className="ls-section-btn-content">
                              <span className={`ls-section-btn-text ${isActive ? 'active' : ''}`}>
                                 {lesson.title}
                              </span>
                              {lesson.videoDuration && (
                                 <span className="ls-section-btn-duration">{lesson.videoDuration}</span>
                              )}
                           </div>
                        </button>
                     </div>
                  );
               })}
            </div>
         </div>

         <div className="lesson-content">
            <div className="lc-topbar">
               <div className="lc-topbar-left">
                  <button
                     type="button"
                     onClick={toggleLeftSidebar}
                     className="lc-topbar-menu-btn"
                     aria-label="Toggle lesson navigation"
                     aria-expanded={leftOpen}
                  >
                     <Menu size={20} />
                  </button>
                  {/* Breadcrumb */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
                     {courseId && (
                        <>
                           <button
                              type="button"
                              id="lesson-back-to-course"
                              onClick={() => navigate(`/course/${courseId}?from=lesson`)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                           >
                              <ArrowLeft size={14} /> Khóa học
                           </button>
                           <span style={{ color: '#cbd5e1' }}>/</span>
                        </>
                     )}
                     <span style={{ fontWeight: 500, color: '#0f172a' }}>
                        {selectedLesson.sectionNumber ? `Section ${selectedLesson.sectionNumber}` : `Lesson ${selectedLesson.orderIndex}`} — {selectedLesson.title}
                     </span>
                  </div>
               </div>
               <div className="lc-topbar-right">
                  <button
                     type="button"
                     onClick={toggleRightSidebar}
                     className="lc-topbar-doc-btn"
                     aria-label="Toggle lesson resources"
                     aria-expanded={rightOpen}
                  >
                     <FileText size={20} />
                  </button>
                  <button 
                     type="button" 
                     className="btn lc-btn-prev"
                     onClick={handlePrev}
                     disabled={!hasPrev}
                     style={{ opacity: hasPrev ? 1 : 0.5, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
                  >
                     <ChevronLeft size={16} className="icon-mr-4" /> Trước
                  </button>
                  <button 
                     type="button" 
                     className={`btn btn-primary lc-btn-next ${isNextDisabled ? 'disabled' : ''}`}
                     onClick={handleNext}
                     disabled={isNextDisabled}
                     title={!hasNext ? "Hết bài học" : (currentProgress < 0.7 ? "Bạn cần học ít nhất 70% để tiếp tục" : "")}
                  >
                     Tiếp theo <ChevronRight size={16} className="icon-ml-4" />
                  </button>
               </div>
            </div>

            <div className="lesson-main">
               <div className="lc-main-container">
                  <div
                     className="video-placeholder"
                     style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        marginBottom: '2rem',
                        background: '#000'
                     }}
                  >
                     <ReactPlayer
                        src={normalizeVideoUrl(selectedLesson.videoUrl)}
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        controls={true}
                        onPlay={() => handlePlay(selectedLesson.id)}
                        onPause={() => handlePause(selectedLesson.id)}
                        onEnded={() => handleEnded(selectedLesson.id)}
                        onProgress={(state) => handleProgress(selectedLesson.id, state)}
                     />
                  </div>

                  <h1 className="lc-title">{selectedLesson.title}</h1>

                  <div className="lc-alert-box" style={{ marginTop: 0 }}>
                     <h4 className="lc-alert-title">
                        <AlertCircle size={20} className="icon-mr-8" />
                        Tiến độ video
                     </h4>
                     <p className="lc-alert-text">
                        Đã xem: {Math.round((lessonProgress[selectedLesson.id]?.played ?? 0) * 100)}% | Thời gian xem: {Math.round(lessonProgress[selectedLesson.id]?.playedSeconds ?? 0)}s | Trạng thái: {lessonProgress[selectedLesson.id]?.completed ? 'Hoàn thành' : 'Đang học'}
                     </p>
                  </div>

                  <div className="lc-text-content">
                     {selectedLesson.contentHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.contentHtml }} />
                     ) : (
                        <p className="lc-paragraph">Chưa có nội dung văn bản cho bài học này.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div className="lesson-sidebar-right" style={{ display: rightOpen ? 'flex' : 'none' }}>
            <div className="rs-header">Tài nguyên & Ghi chú</div>

            <div className="rs-content">
               <div>
                  <h4 className="rs-section-title">Tài liệu đính kèm</h4>
                  <div className="rs-resource-list">
                     <p style={{ fontSize: '0.85rem', color: '#64748b', padding: '0.5rem' }}>
                        Chưa có tài liệu cho bài học này.
                     </p>
                  </div>
               </div>

               <div>
                  <h4 className="rs-section-title">Ghi chú cá nhân</h4>
                  <textarea
                     className="rs-textarea"
                     placeholder="Viết ghi chú tại đây... (được lưu tự động)"
                  ></textarea>
               </div>

               <div className="rs-discussion-box">
                  <h4 className="rs-discussion-title">
                     <MessageSquare size={16} className="icon-mr-8" /> Thảo luận bài học
                  </h4>
                  <p className="rs-discussion-text">Bắt đầu thảo luận về bài học này.</p>
                  <button type="button" className="rs-discussion-btn">
                     Gửi câu hỏi
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Lesson;
