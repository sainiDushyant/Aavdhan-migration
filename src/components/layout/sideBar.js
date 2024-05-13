import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Award, Menu as Hamburger } from 'react-feather';

const SideBar = ({ collapsed: propCollapsed, toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(propCollapsed);
  const [sidebarWidth, setSidebarWidth] = useState(
    propCollapsed ? '80px' : '250px'
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
    toggleSidebar();
  };

  useEffect(() => {
    setSidebarWidth(collapsed ? '80px' : '250px');
  }, [collapsed]);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <>
      {isMobile && collapsed ? ( // Render Hamburger icon for small screens and collapsed sidebar
        <div
          className="d-flex align-items-center gap-2"
          style={{ paddingLeft: '10px', paddingTop: '20px' }}
        >
          <Hamburger
            onClick={handleToggleSidebar}
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        </div>
      ) : (
        <Sidebar // Render the entire sidebar for larger screens
          collapsed={collapsed}
          style={{
            background: '#FFFFFF',
            height: '98vh',
            overflowX: 'hidden',
            width: sidebarWidth,
          }}
        >
          <div
            className="d-flex align-items-center gap-2"
            style={{ paddingLeft: '10px', paddingTop: '20px' }}
          >
            <>
              <img
                src={`${process.env.PUBLIC_URL}/logo.ico`}
                alt="Avdhaan Logo"
                onClick={handleToggleSidebar}
              />
              <h1 style={{ fontWeight: 'bold' }}>Avdhaan</h1>
            </>
          </div>
          <Menu>
            <SubMenu icon={<Award size={18} />} label="Charts">
              <MenuItem>one</MenuItem>
              <MenuItem>two</MenuItem>
            </SubMenu>
            <MenuItem>
              <Award size={18} /> &nbsp; Documentation
            </MenuItem>
            <MenuItem>
              <Award size={18} /> &nbsp; Calendar
            </MenuItem>
            <MenuItem>
              <Award size={18} /> &nbsp; E-commerce
            </MenuItem>
            <MenuItem>
              <Award size={18} /> &nbsp; Examples
            </MenuItem>
          </Menu>
        </Sidebar>
      )}
    </>
  );
};

export default SideBar;
