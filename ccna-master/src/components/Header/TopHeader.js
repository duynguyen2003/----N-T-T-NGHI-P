import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Router as RouterIcon } from 'lucide-react';

const TopHeader = () => {
    return (
        <header className="top-header">
            <div className="top-header-container">
          <Link to="/" className="logo">
          <div className="logo-icon">
            <RouterIcon size={24} color="white" />
          </div>
          <span className="logo-text notranslate">NetMastery</span>
        </Link>

                {/* Center: Search Bar */}
                <div className="top-header-center">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học, bài viết, video, ..."
                            className="search-input "
                        />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="top-header-right">
                    <Link to="/my-courses" className="my-courses-text">
                        Khóa học của tôi
                    </Link>

                    <button className="top-action-btn" title="Thông báo">
                        <Bell size={20} />
                        <span className="btn-badge"></span>
                    </button>

                    <Link to="/profile" className="top-user-profile">
                        <div className="top-avatar">
                            <User size={18} />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
