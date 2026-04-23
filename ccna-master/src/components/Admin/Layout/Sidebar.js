import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, FileText, Activity, Wrench, FolderOpen } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-header">
        <div className="admin-brand-icon">
          <span className="material-icons-round">router</span>
        </div>
        <div className="admin-brand-text">
          <span className="admin-brand-title">NetMastery</span>
          <span className="admin-brand-subtitle">HỌC MẠNG ĐỂ ĐI LÀM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav" >
        <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={19} />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={19} />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/admin/exams" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={19} />
          <span>Exams</span>
        </NavLink>
        <NavLink to="/admin/labs" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={19} />
          <span>Labs</span>
        </NavLink>
        <NavLink to="/admin/resources" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <FolderOpen size={19} />
          <span>Resources</span>
        </NavLink>
        <NavLink to="/admin/tools" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <Wrench size={19} />
          <span>Tools</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
