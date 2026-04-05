import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isOpen, closeMenu }) => {
  const location = useLocation();

  // Hàm check active path
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <Link className={`sidebar-link ${isActive('/') ? 'active' : ''}`} to="/" onClick={closeMenu}>
          <span className="material-icons-round">home</span>
          <span className="tag-name">Trang chủ</span>
        </Link>
        <Link className={`sidebar-link ${isActive('/roadmap') ? 'active' : ''}`} to="/roadmap" onClick={closeMenu}>
          <span className="material-icons-round">map</span>
          <span className="tag-name">Lộ trình</span>
        </Link>
        <Link className={`sidebar-link ${isActive('/lesson') ? 'active' : ''}`} to="/lesson" onClick={closeMenu}>
          <span className="material-icons-round">auto_stories</span>
          <span className="tag-name">Khóa học</span>
        </Link>
        <Link className={`sidebar-link ${isActive('/labs') ? 'active' : ''}`} to="/labs" onClick={closeMenu}>
          <span className="material-icons-round">terminal</span>
          <span className="tag-name">Thực hành</span>
        </Link>
        <Link className={`sidebar-link ${isActive('/exam') ? 'active' : ''}`} to="/exam" onClick={closeMenu}>
          <span className="material-icons-round">quiz</span>
          <span className="tag-name">Kiểm tra</span>
        </Link>
        <Link className={`sidebar-link ${isActive('/resources') ? 'active' : ''}`} to="/resources" onClick={closeMenu}>
          <span className="material-icons-round">folder</span>
          <span className="tag-name">Tài liệu</span>
        </Link>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <Link className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile" onClick={closeMenu}>
          <span className="material-icons-round">person_outline</span>
          <span className="tag-name">Hồ sơ</span>
        </Link>
      </div>
    </aside>
  );
};

export default Navbar;
