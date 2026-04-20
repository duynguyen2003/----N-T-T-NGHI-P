import React, { useContext } from 'react';
import { LogOut, User } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="admin-topbar">
      <div className="topbar-breadcrumb">
        <span>Admin Panel / {getPageTitle()}</span>
      </div>
      <div className="topbar-actions">
        <div className="admin-profile">
          <User size={20} />
          <span>{user?.fullName || 'Administrator'}</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
