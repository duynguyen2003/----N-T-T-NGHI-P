import React from 'react';
import '../../../css/Admin/AdminLayout.css';
import '../../../css/Admin/AdminVariables.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar-container">{/* Sidebar Component here */}</div>
      <div className="admin-main-content">
        {/* TopBar Component here */}
        <div className="admin-page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
