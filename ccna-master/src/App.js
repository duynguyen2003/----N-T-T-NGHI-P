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
import './css/ExamFlow.css'; // Phân hệ Kiểm tra & Đánh giá
import './css/Doc.css';
import './css/Profile.css';
import './css/Footer.css';
import './css/Auth/Auth.css'; // CSS cho trang Đăng ký / Đăng nhập
import './css/CourseDetail.css'; // CSS cho trang Chi tiết Khóa học
import './css/Tools/SubnetCalculator.css'; // CSS cho trang Subnet Calculator
import './css/Tools/VLSM_Calculator.css'; // CSS cho trang VLSM Calculator
import './css/Tools/PortLookup.css'; // CSS cho trang Port Lookup
import './css/Tools/CiscoCliLookup.css'; // CSS cho trang Cisco CLI Lookup

// Import Layout (Chứa Header và Footer)
import Layout from './components/Content/Layout';

// Import Admin Layout & Pages
import AdminLayout from './components/Admin/Layout/AdminLayout';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import Dashboard from './components/Admin/Views/Dashboard';
import Users from './components/Admin/Views/Users';
import Courses from './components/Admin/Views/Courses';
import Exams from './components/Admin/Views/Exams';
import Labs from './components/Admin/Views/Labs';
import AdminCourseDetail from './components/Admin/Views/CourseDetail';
import AdminTools from './components/Admin/Views/Tools';
import AdminResources from './components/Admin/Views/Resources';

// Import các Trang nội dung (Content Pages)
import Home from './components/Content/Home.js';
import Roadmap from './components/Content/Roadmap.js';
import Lesson from './components/Content/Lesson.js';
import LabsView from './components/Content/Labs.js';
import Exam from './components/Content/Exam.js';
import Resources from './components/Content/Doc.js';
import Profile from './components/Content/Profile.js';
import CourseDetail from './components/Content/CourseDetail.js';

// Import Auth Pages
import Login from './components/Auth/Login.js';
import ForgotPassword from './components/Auth/ForgotPassword.js';
import Register from './components/Auth/Register.js';
import ResetPassword from './components/Auth/ResetPassword.js';
import ProtectedRoute from './components/Auth/ProtectedRoute.js';

// Import Tools Pages
import SubnetCalculator from './components/Tools/SubnetCalculator.js';
import VLSMCalculator from './components/Tools/VLSM_Calculator.js';
import PortLookup from './components/Tools/PortLookup.js';
import CiscoCliLookup from './components/Tools/CiscoCliLookup.js';



function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            ADMIN ROUTES (Isolated Layout)
            ========================================= */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:courseId" element={<AdminCourseDetail />} />
                <Route path="exams" element={<Exams />} />
                <Route path="labs" element={<Labs />} />
                <Route path="tools" element={<AdminTools />} />
                <Route path="resources" element={<AdminResources />} />
              </Routes>
            </AdminLayout>
          </AdminProtectedRoute>
        } />



        {/* =========================================
            USER/STUDENT ROUTES (With Layout)
            ========================================= */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* AUTH AS MODALS */}
              <Route path="/login" element={<><Home /><Login /></>} />
              <Route path="/register" element={<><Home /><Register /></>} />
              <Route path="/forgot-password" element={<><Home /><ForgotPassword /></>} />
              <Route path="/reset-password/:token" element={<><Home /><ResetPassword /></>} />

              {/* Trang bảo vệ */}
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/lesson" element={<Lesson />} />
              <Route path="/labs" element={<LabsView />} />
              <Route path="/exam/*" element={<Exam />} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/tools/subnet" element={<ProtectedRoute><SubnetCalculator /></ProtectedRoute>} />
              <Route path="/tools/vlsm" element={<ProtectedRoute><VLSMCalculator /></ProtectedRoute>} />
              <Route path="/tools/ports" element={<ProtectedRoute><PortLookup /></ProtectedRoute>} />
              <Route path="/tools/cli" element={<ProtectedRoute><CiscoCliLookup /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
