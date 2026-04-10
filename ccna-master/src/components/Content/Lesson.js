import React, { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import {
   ChevronLeft, ChevronRight, Menu, FileText,
   AlertCircle, Download, CheckCircle, MessageSquare, Play
} from 'lucide-react';

const MOBILE_BREAKPOINT = 1024;
const RESOURCE_BREAKPOINT = 1280;

const initialLessons = [
   {
      id: 1,
      section: 'Section 3.1',
      title: 'Overview of VLANs',
      videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
      completed: true
   },
   {
      id: 2,
      section: 'Section 3.2',
      title: 'VLAN Definitions',
      videoUrl: 'https://www.youtube.com/embed/H8W9oMNSuwo?list=PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ',
      completed: false
   },
   {
      id: 3,
      section: 'Section 3.3',
      title: 'Benefits of VLAN Design',
      videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
      completed: false
   },
   {
      id: 4,
      section: 'Section 3.4',
      title: 'Knowledge Check',
      videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
      completed: false
   }
];

const getViewportWidth = () => (
   typeof window === 'undefined' ? RESOURCE_BREAKPOINT : window.innerWidth
);

const extractIframeSrc = (value) => {
   const match = value.match(/src=["']([^"']+)["']/i);
   return match ? match[1] : value;
};

const normalizeVideoUrl = (value) => {
   if (!value) return '';
   return extractIframeSrc(value.trim());
};

const defaultProgressState = () => ({
   played: 0,
   playedSeconds: 0,
   loaded: 0,
   loadedSeconds: 0,
   completed: false
});

const Lesson = () => {
   const [viewportWidth, setViewportWidth] = useState(getViewportWidth);
   const [leftOpen, setLeftOpen] = useState(() => getViewportWidth() >= MOBILE_BREAKPOINT);
   const [rightOpen, setRightOpen] = useState(() => getViewportWidth() >= RESOURCE_BREAKPOINT);
   const [selectedLessonId, setSelectedLessonId] = useState(2);
   const [lessons, setLessons] = useState(initialLessons);
   const [lessonProgress, setLessonProgress] = useState(() =>
      initialLessons.reduce((accumulator, lesson) => {
         accumulator[lesson.id] = {
            ...defaultProgressState(),
            completed: lesson.completed
         };
         return accumulator;
      }, {})
   );

   const isMobile = viewportWidth < MOBILE_BREAKPOINT;
   const isCompact = viewportWidth < RESOURCE_BREAKPOINT;

   useEffect(() => {
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      setLeftOpen(!isMobile);
   }, [isMobile]);

   useEffect(() => {
      setRightOpen(!isCompact);
   }, [isCompact]);

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
      const completed = state.played >= 0.95;

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

      console.log('onProgress', {
         lessonId,
         played: state.played,
         playedSeconds: state.playedSeconds,
         loaded: state.loaded,
         loadedSeconds: state.loadedSeconds,
         completed
      });
   };

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
               <small className="ls-course-label">SRWE Course</small>
               <h3 className="ls-module-title">Module 3: VLANs & Inter-VLAN Routing</h3>
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
                        <div className="ls-section-label">{lesson.section}</div>
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
                           <span className={`ls-section-btn-text ${isActive ? 'active' : ''}`}>
                              {lesson.title}
                           </span>
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
                  <h2 className="lc-topbar-title">{selectedLesson.section} {selectedLesson.title}</h2>
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
                  <button type="button" className="btn lc-btn-prev">
                     <ChevronLeft size={16} className="icon-mr-4" /> Trước
                  </button>
                  <button type="button" className="btn btn-primary lc-btn-next">
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
                     <p className="lc-paragraph">
                        VLAN (Virtual LAN) là một công nghệ cho phép chia một mạng vật lý thành nhiều mạng logic khác nhau. Điều này giúp tăng cường bảo mật, giảm kích thước miền broadcast và dễ dàng quản lý.
                     </p>

                     <h3 className="lc-heading">1. Default VLAN</h3>
                     <p className="lc-sub-paragraph">
                        VLAN mặc định trên Switch Cisco là VLAN 1. Tất cả các cổng của Switch mặc định thuộc về VLAN 1. Lưu ý: Không thể đổi tên hoặc xóa VLAN 1.
                     </p>

                     <h3 className="lc-heading">2. Data VLAN</h3>
                     <p className="lc-sub-paragraph">
                        Được cấu hình để mang lưu lượng người dùng (user generated traffic). Tách biệt thoại (Voice) và dữ liệu quản lý.
                     </p>

                     <div className="lc-alert-box">
                        <h4 className="lc-alert-title">
                           <AlertCircle size={20} className="icon-mr-8" />
                           Best Practice
                        </h4>
                        <p className="lc-alert-text">
                           Cisco khuyến nghị tách biệt lưu lượng Voice và Data. Voice traffic yêu cầu băng thông đảm bảo, ưu tiên (QoS) và độ trễ thấp dưới 150ms.
                        </p>
                     </div>

                     <h3 className="lc-heading">Cấu hình mẫu (CLI)</h3>
                     <pre className="lc-code-block">
                        {`Switch > enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config - vlan)# name Student
Switch(config - vlan)# exit
Switch(config)# interface range f0 / 1 - 10
Switch(config -if-range)# switchport mode access
Switch(config -if-range)# switchport access vlan 10`}
                     </pre>
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
                     <button type="button" className="rs-resource-item">
                        <FileText size={24} color="#ef4444" className="icon-mr-075" />
                        <div className="rs-resource-info">
                           <div className="rs-resource-name">Slide_VLANs.pdf</div>
                           <div className="rs-resource-size">2.4 MB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </button>
                     <button type="button" className="rs-resource-item">
                        <div className="rs-pkt-icon">PKT</div>
                        <div className="rs-resource-info">
                           <div className="rs-resource-name">Lab_3.2_VLAN.pkt</div>
                           <div className="rs-resource-size">156 KB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </button>
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
                  <p className="rs-discussion-text">Có 12 câu hỏi về bài học này.</p>
                  <button type="button" className="rs-discussion-btn">
                     Xem thảo luận
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Lesson;
