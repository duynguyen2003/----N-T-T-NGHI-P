import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../../css/Admin/AdminLayout.css';
import '../../../css/Admin/AdminVariables.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar-container">
        <Sidebar />
      </div>
      <div className="admin-main-content">
        <TopBar />
        <div className="admin-page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
