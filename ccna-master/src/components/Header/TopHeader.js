import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Router as RouterIcon } from 'lucide-react';

const TopHeader = () => {
    return (
        <header className="header">
            <Link to="/" className="header-left" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="logo-icon">
                    <span className="material-icons-round">router</span>
                </div>
                <div className="logo-text">
                    <span className="logo-title">NetMastery</span>
                    <span className="logo-subtitle">HỌC MẠNG ĐỂ ĐI LÀM</span>
                </div>
            </Link>

            <div className="header-center">
                <div className="search-box">
                    <span className="material-icons-round search-icon">search</span>
                    <input
                        className="search-input"
                        placeholder="Tìm kiếm khóa học..."
                        type="text"
                    />
                </div>
            </div>

            <div className="header-right">
                <a className="nav-link" href="#courses">Khóa học của tôi</a>
                <button className="icon-btn">
                    <span className="material-icons-round">notifications</span>
                    <span className="badge"></span>
                </button>
                <img
                    alt="User avatar"
                    className="avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg_zrRPJPMXRzm3ElxM9kgg7g6Sg-4ksF4aQtrojscWj216aqIWKJnHtSKkdXA0VPQtSzUg9bCHGMs4CZgMjkQIWS8u3qYNfs5hRhvPqTliuV2JlIeD5bLXfOXIIfzGVZjWFKykKKjkdpV2LatnBM7GfVZcUZErssjUFtqwhop_0rlhiaU_jn-uJ4MjDc3_f6vDiLP0A36dUsNcs7NaPUu-SSGZ0WuXTnDHVlCkqh3yPdG-GSYYl84u7YiEeMtAg3vXDQtgRvsMik"
                />
            </div>
        </header>
    );
};

export default TopHeader;
