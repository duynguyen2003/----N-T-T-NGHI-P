import React, { useContext } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const pageTitles = {
    dashboard: 'Overview',
    users: 'Users Management',
    courses: 'Courses Management',
    exams: 'Exams Management',
    labs: 'Labs Management',
    resources: 'Resources Management',
    tools: 'Tools Management'
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    return pageTitles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="admin-topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <span className="topbar-breadcrumb">{getPageTitle()}</span>
      </div>
      <div className="topbar-actions">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <div className="admin-topbar-avatar">
          {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
