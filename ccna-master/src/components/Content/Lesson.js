import React, { useState } from 'react';
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
         <div className="lesson-sidebar" style={{ display: leftOpen ? 'block' : 'none', width: '300px', flexShrink: 0 }}>
            <div style={{ padding: '1rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
               <small style={{ fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', fontSize: '0.75rem' }}>SRWE Course</small>
               <h3 style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>Module 3: VLANs & Inter-VLAN Routing</h3>
               {/* Progress bar */}
               <div style={{ width: '100%', height: '6px', background: '#cbd5e1', borderRadius: '99px', marginTop: '0.75rem' }}>
                  <div style={{ width: '45%', height: '100%', background: '#2563eb', borderRadius: '99px' }}></div>
               </div>
            </div>

            <div style={{ padding: '0.5rem 0' }}>
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                     <div style={{ padding: '0 1rem', fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Section 3.{i}
                     </div>
                     <button style={{
                        width: '100%', textAlign: 'left', padding: '0.5rem 1rem', display: 'flex', alignItems: 'flex-start',
                        background: i === 2 ? '#eff6ff' : 'transparent',
                        border: 'none', borderLeft: i === 2 ? '4px solid #2563eb' : '4px solid transparent',
                        color: i === 2 ? '#1d4ed8' : '#475569', cursor: 'pointer'
                     }}>
                        <div style={{ marginRight: '0.75rem', marginTop: '2px' }}>
                           {i === 1 ? <CheckCircle size={16} color="#22c55e" /> :
                              i === 2 ? <Play size={16} fill="currentColor" /> :
                                 <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div>}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: i === 2 ? '600' : '400' }}>
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
            <div style={{ height: '56px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'space-between', flexShrink: 0 }}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => setLeftOpen(!leftOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem', color: '#64748b' }}>
                     <Menu size={20} />
                  </button>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>3.2 VLAN Definitions</h2>
               </div>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setRightOpen(!rightOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#64748b', display: window.innerWidth < 1024 ? 'block' : 'none' }}>
                     <FileText size={20} />
                  </button>
                  <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#f1f5f9', color: '#475569' }}>
                     <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Trước
                  </button>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                     Tiếp theo <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </button>
               </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="lesson-main">
               <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                  {/* Video Player */}
                  <div className="video-placeholder">
                     <div style={{ width: '64px', height: '64px', background: 'rgba(37,99,235,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={32} fill="white" color="white" style={{ marginLeft: '4px' }} />
                     </div>
                     <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '1rem', color: 'white' }}>
                        <div style={{ fontWeight: '600' }}>Video 3.2: VLAN Concepts Explained</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Thời lượng: 12:45</div>
                     </div>
                  </div>

                  <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem' }}>VLAN Definitions & Types</h1>

                  <div style={{ lineHeight: 1.8, color: '#334155' }}>
                     <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#475569' }}>
                        VLAN (Virtual LAN) là một công nghệ cho phép chia một mạng vật lý thành nhiều mạng logic khác nhau. Điều này giúp tăng cường bảo mật, giảm kích thước miền broadcast và dễ dàng quản lý.
                     </p>

                     <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginTop: '2rem', marginBottom: '1rem' }}>1. Default VLAN</h3>
                     <p style={{ marginBottom: '1rem' }}>
                        VLAN mặc định trên Switch Cisco là VLAN 1. Tất cả các cổng của Switch mặc định thuộc về VLAN 1.
                        Lưu ý: Không thể đổi tên hoặc xóa VLAN 1.
                     </p>

                     <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginTop: '2rem', marginBottom: '1rem' }}>2. Data VLAN</h3>
                     <p style={{ marginBottom: '1rem' }}>
                        Được cấu hình để mang lưu lượng người dùng (user generated traffic). Tách biệt thoại (Voice) và dữ liệu quản lý.
                     </p>

                     {/* Alert Box */}
                     <div style={{ background: '#eff6ff', borderLeft: '4px solid #2563eb', padding: '1.5rem', borderRadius: '0.5rem', margin: '2rem 0' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', color: '#1e3a8a', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                           <AlertCircle size={20} style={{ marginRight: '8px' }} />
                           Best Practice
                        </h4>
                        <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>
                           Cisco khuyến nghị tách biệt lưu lượng Voice và Data. Voice traffic yêu cầu băng thông đảm bảo, ưu tiên (QoS) và độ trễ thấp dưới 150ms.
                        </p>
                     </div>

                     <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginTop: '2rem', marginBottom: '1rem' }}>Cấu hình mẫu (CLI)</h3>
                     <pre style={{ background: '#0f172a', color: '#f1f5f9', padding: '1.5rem', borderRadius: '0.75rem', overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.9rem' }}>
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
         <div style={{
            width: '300px', background: 'white', borderLeft: '1px solid #e2e8f0',
            display: rightOpen ? 'flex' : 'none', flexDirection: 'column', flexShrink: 0
         }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: '#0f172a' }}>
               Tài nguyên & Ghi chú
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {/* Resources List */}
               <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tài liệu đính kèm</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <a href="#" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none' }}>
                        <FileText size={24} color="#ef4444" style={{ marginRight: '0.75rem' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                           <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Slide_VLANs.pdf</div>
                           <div style={{ fontSize: '0.75rem', color: '#64748b' }}>2.4 MB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </a>
                     <a href="#" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none' }}>
                        <div style={{ width: '24px', height: '24px', background: '#dcfce7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold', fontSize: '0.6rem', marginRight: '0.75rem' }}>PKT</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                           <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lab_3.2_VLAN.pkt</div>
                           <div style={{ fontSize: '0.75rem', color: '#64748b' }}>156 KB</div>
                        </div>
                        <Download size={16} color="#94a3b8" />
                     </a>
                  </div>
               </div>

               {/* Notes Area */}
               <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Ghi chú cá nhân</h4>
                  <textarea
                     style={{ width: '100%', height: '160px', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
                     placeholder="Viết ghi chú tại đây... (được lưu tự động)"
                  ></textarea>
               </div>

               {/* Discussion */}
               <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#312e81', display: 'flex', alignItems: 'center', margin: '0 0 0.5rem 0' }}>
                     <MessageSquare size={16} style={{ marginRight: '8px' }} /> Thảo luận bài học
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#4338ca', marginBottom: '0.75rem' }}>Có 12 câu hỏi về bài học này.</p>
                  <button style={{ width: '100%', padding: '0.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                     Xem thảo luận
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Lesson;