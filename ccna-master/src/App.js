import React from 'react';
// Sử dụng HashRouter để dễ dàng chạy demo mà không cần cấu hình server
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import CSS toàn cục
import './App.css';
// Import các CSS trang chi tiết
import './css/Navbar.css';
import './css/TopHeader.css';
import './css/Home.css';
import './css/Roadmap.css';
import './css/Lesson.css';
import './css/Labs.css';
import './css/Exam.css';
import './css/Doc.css';
import './css/Profile.css';

// Import Layout (Chứa Header và Footer)
import Layout from './components/Content/Layout';

// Import các Trang nội dung (Content Pages)
import Home from './components/Content/Home.js';
import Roadmap from './components/Content/Roadmap.js';
import Lesson from './components/Content/Lesson.js';
import Labs from './components/Content/Labs.js';
import Exam from './components/Content/Exam.js';
import Resources from './components/Content/Doc.js';
import Profile from './components/Content/Profile.js';

function App() {
  return (
    <Router>
      {/* Layout bọc bên ngoài để Navbar và Footer luôn hiển thị */}
      <Layout>
        <Routes>
          {/* Định nghĩa các đường dẫn URL */}
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />

          {/* Nếu người dùng nhập đường dẫn sai, tự động chuyển về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;