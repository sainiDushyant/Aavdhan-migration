import React, { useState } from 'react';
import SideBar from './sideBar';
import Footer from '../../@core/layouts/components/footer';
import Header from '../../@core/layouts/components/Header';

const LayoutWrapper = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Header />
      <div
        className="row flex-absolute"
        style={{ minHeight: 'calc(100vh - 106px)' }}
      >
        <div style={{ position: 'fixed', top: 0, bottom: 0, zIndex: 999 }}>
          <SideBar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>
        <div
          className={`col-md-${sidebarCollapsed ? '10' : '9'} offset-md-${
            sidebarCollapsed ? '1' : '2'
          }`}
          style={{ zIndex: 1000 }}
        >
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
