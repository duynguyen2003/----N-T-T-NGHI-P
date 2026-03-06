import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Map, Network, FileText, User, GraduationCap, Router as RouterIcon } from 'lucide-react';

const Navbar = ({ isOpen, closeMenu }) => {
  const location = useLocation();

  // Hàm check active path
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Lộ trình', path: '/roadmap', icon: Map },
    { name: 'Bài học', path: '/lesson', icon: BookOpen },
    { name: 'Lab', path: '/labs', icon: Network },
    { name: 'Thi thử', path: '/exam', icon: GraduationCap },
    { name: 'Tài liệu', path: '/resources', icon: FileText },
    { name: 'Hồ sơ', path: '/profile', icon: User },
  ];

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="nav-container"> 
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMenu}
              title={item.name}
            >
              <div className="nav-icon-box">
                <item.icon size={22} className="nav-icon" />
              </div>
              <span className="nav-label notranslate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
