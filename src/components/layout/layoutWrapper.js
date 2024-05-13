import React, { useState, useEffect } from 'react';
import SideBar from './sideBar';
import Footer from '../../@core/layouts/components/footer';
import Header from '../../@core/layouts/components/Header';

const LayoutWrapper = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initially based on screen width
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setWindowHeight(height);
      setIsMobile(window.innerWidth < 768); // Update state on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, []);

  // Calculate the threshold height (80% of window height)
  const thresholdWidth = window.innerWidth * 0.8;

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />{' '}
      <div
        className="row flex-absolute"
        style={{ minHeight: 'calc(100vh - 106px)', overflowX: 'hidden' }}
      >
        <div
          className={`col-md-${
            sidebarCollapsed ? '1' : '2'
          } position-fixed top-0 bottom-0`}
          style={{
            zIndex: '1100',
            overflowY: 'auto',
            width: `${sidebarCollapsed ? 'auto' : '280px'}`,
            transition: 'width 0.3s ease',
          }}
        >
          <SideBar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        <div
          className={`col-md-${
            isMobile ? '12' : sidebarCollapsed ? '11' : '10'
          } offset-md-${sidebarCollapsed ? '1' : '2'} mt-5`}
          style={{
            position: 'absolute',
            zIndex: isMobile ? '-1' : '0',
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
