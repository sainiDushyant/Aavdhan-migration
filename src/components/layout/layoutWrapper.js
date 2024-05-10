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
    <div
      className="d-flex flex-column"
      style={{ minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Header />
      <div
        className="row flex-absolute"
        style={{ minHeight: 'calc(100vh - 106px)', overflowX: 'hidden' }}
      >
        <div
          className={`col-md-${
            sidebarCollapsed ? '1' : '2'
          } position-fixed top-0 bottom-0`}
          style={{
            zIndex: 999,
            overflowY: 'auto',
            width: `${sidebarCollapsed ? 'auto' : '280px'}`,
            transition: 'width 0.3s ease',
          }}
        >
          <SideBar
            collapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            className="d-block"
          />
        </div>
        <div
          className={`col-md-${sidebarCollapsed ? '11' : '10'} offset-md-${
            sidebarCollapsed ? '1' : '2'
          } col-sm-12`}
          style={{
            position: 'relative',
            marginLeft: `${sidebarCollapsed ? '120px' : '280px'}`,
            transition: 'margin-left 0.3s ease',
          }}
        >
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
