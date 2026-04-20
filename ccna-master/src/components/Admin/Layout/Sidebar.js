import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, FileText, Activity } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>CCNA Admin</h2>
      </div>
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/admin/exams" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Exams</span>
        </NavLink>
        <NavLink to="/admin/labs" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          <span>Labs</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
