import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import {
   ChevronLeft, ChevronRight, Menu, FileText, Video,
   AlertCircle, Download, CheckCircle, MessageSquare, Play
} from 'lucide-react';

const Lesson = () => {
   const [leftOpen, setLeftOpen] = useState(true);
   const [rightOpen, setRightOpen] = useState(true);

   return (
      <div className="lesson-layout">

         {/* --- LEFT SIDEBAR: Navigation --- */}
         <div className="lesson-sidebar" style={{ display: leftOpen ? 'block' : 'none' }}>
            <div className="ls-header">
               <small className="ls-course-label">SRWE Course</small>
               <h3 className="ls-module-title">Module 3: VLANs & Inter-VLAN Routing</h3>
               {/* Progress bar */}
               <div className="ls-progress-bg">
                  <div className="ls-progress-bar"></div>
               </div>
            </div>

            <div className="ls-section-list">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="ls-section-item">
                     <div className="ls-section-label">
                        Section 3.{i}
                     </div>
                     <button className={`ls-section-btn ${i === 2 ? 'active' : ''}`}>
                        <div className="ls-section-btn-icon">
                           {i === 1 ? <CheckCircle size={16} color="#22c55e" /> :
                              i === 2 ? <Play size={16} fill="currentColor" /> :
                                 <div className="ls-section-btn-icon-empty"></div>}
                        </div>
                        <span className={`ls-section-btn-text ${i === 2 ? 'active' : ''}`}>
                           {i === 1 ? 'Overview of VLANs' :
                              i === 2 ? 'VLAN Definitions' :
                                 i === 3 ? 'Benefits of VLAN Design' :
                                    'Knowledge Check'}
                        </span>
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* --- CENTER PANE: Content --- */}
         <div className="lesson-content">
            {/* Top Control Bar */}
            <div className="lc-topbar">
               <div className="lc-topbar-left">
                  <button onClick={() => setLeftOpen(!leftOpen)} className="lc-topbar-menu-btn">
                     <Menu size={20} />
                  </button>
                  <h2 className="lc-topbar-title">3.2 VLAN Definitions</h2>
               </div>
               <div className="lc-topbar-right">
                  <button onClick={() => setRightOpen(!rightOpen)} className="lc-topbar-doc-btn">
                     <FileText size={20} />
                  </button>
                  <button className="btn lc-btn-prev">
                     <ChevronLeft size={16} className="icon-mr-4" /> Trước
                  </button>
                  <button className="btn btn-primary lc-btn-next">
                     Tiếp theo <ChevronRight size={16} className="icon-ml-4" />
                  </button>
               </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="lesson-main">
               <div className="lc-main-container">

                  {/* Video Player - Cách chuẩn của ReactPlayer */}
                  <div className="video-placeholder" style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', background: '#000' }}>
                     <ReactPlayer
                        url="https://www.youtube.com/watch?v=qiQR5rTSshw"
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        controls={true}
                     />
                  </div>
                  <h1 className="lc-title">VLAN Definitions & Types</h1>

                  <div className="lc-text-content">
                     <p className="lc-paragraph">
                        VLAN (Virtual LAN) là một công nghệ cho phép chia một mạng vật lý thành nhiều mạng logic khác nhau. Điều này giúp tăng cường bảo mật, giảm kích thước miền broadcast và dễ dàng quản lý.
                     </p>

                     <h3 className="lc-heading">1. Default VLAN</h3>
                     <p className="lc-sub-paragraph">
                        VLAN mặc định trên Switch Cisco là VLAN 1. Tất cả các cổng của Switch mặc định thuộc về VLAN 1.
                        Lưu ý: Không thể đổi tên hoặc xóa VLAN 1.
                     </p>

                     <h3 className="lc-heading">2. Data VLAN</h3>
                     <p className="lc-sub-paragraph">
                        Được cấu hình để mang lưu lượng người dùng (user generated traffic). Tách biệt thoại (Voice) và dữ liệu quản lý.
                     </p>

                     {/* Alert Box */}
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

         {/* --- RIGHT SIDEBAR: Resources --- */}
         <div className="lesson-sidebar-right" style={{ display: rightOpen ? 'flex' : 'none' }}>
            <div className="rs-header">
               Tài nguyên & Ghi chú
            </div>

            <div className="rs-content">
               {/* Resources List */}
               <div>
                  <h4 className="rs-section-title">Tài liệu đính kèm</h4>
                  <div className="rs-resource-list">
                     <a href="#" className="rs-resource-item">
                        <FileText size={24} color="#ef4444" className="icon-mr-075" />
                        <div className="rs-resource-info">
                           <div className="rs-resource-name">Slide_VLANs.pdf</div>
                           <div className="rs-resource-size">2.4 MB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </a>
                     <a href="#" className="rs-resource-item">
                        <div className="rs-pkt-icon">PKT</div>
                        <div className="rs-resource-info">
                           <div className="rs-resource-name">Lab_3.2_VLAN.pkt</div>
                           <div className="rs-resource-size">156 KB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </a>
                  </div>
               </div>

               {/* Notes Area */}
               <div>
                  <h4 className="rs-section-title">Ghi chú cá nhân</h4>
                  <textarea
                     className="rs-textarea"
                     placeholder="Viết ghi chú tại đây... (được lưu tự động)"
                  ></textarea>
               </div>

               {/* Discussion */}
               <div className="rs-discussion-box">
                  <h4 className="rs-discussion-title">
                     <MessageSquare size={16} className="icon-mr-8" /> Thảo luận bài học
                  </h4>
                  <p className="rs-discussion-text">Có 12 câu hỏi về bài học này.</p>
                  <button className="rs-discussion-btn">
                     Xem thảo luận
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Lesson;