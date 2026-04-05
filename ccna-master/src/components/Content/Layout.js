import React, { useState } from 'react';
import Navbar from '../Header/Navbar'; // Import từ thư mục Header
import TopHeader from '../Header/TopHeader'; // Import TopHeader
import Footer from '../Footer/Footer'; // Import từ thư mục Footer
import { Menu, X } from 'lucide-react'; // Import icons for toggle

const Layout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className={`layout-container ${isDrawerOpen ? 'drawer-open' : ''}`}>
      {/* Mobile Toggle Button */}
      <button className="drawer-toggle" onClick={toggleDrawer}>
        {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay to close drawer when clicking outside */}
      {isDrawerOpen && <div className="drawer-overlay" onClick={toggleDrawer}></div>}

      <TopHeader />
      <div className="layout-body">
        <Navbar isOpen={isDrawerOpen} closeMenu={() => setIsDrawerOpen(false)} />

        <div className="main-wrapper">
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>

      {/* Footer nằm ngoài layout-body để span toàn bộ chiều rộng,
          kể cả phần sidebar, không bị navbar che */}
      <Footer />
    </div>
  );
};

export default Layout;