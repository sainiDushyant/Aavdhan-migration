import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Circle, Award, Menu as Hamburger } from 'react-feather';

const SideBar = ({ collapsed: propCollapsed, toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(propCollapsed);

  // Function to toggle sidebar
  const handleToggleSidebar = () => {
    toggleSidebar();
    setCollapsed(!collapsed);
  };

  // Effect to collapse sidebar on window resize for small devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call handleResize initially
    handleResize();

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Sidebar
      collapsed={collapsed}
      style={{ background: '#ffffff', height: '100vh', overflowX: 'hidden' }}
      onMouseEnter={() => collapsed && handleToggleSidebar()}
    >
      <div
        className="d-flex align-items-center gap-2"
        style={{ paddingLeft: '10px', paddingTop: '20px' }}
      >
        {!collapsed ? (
          <>
            <img
              src={`${process.env.PUBLIC_URL}/logo.ico`}
              alt="Avdhaan Logo"
              onClick={handleToggleSidebar}
            />
            <h1 style={{ fontWeight: 'bold' }}>Avdhaan</h1>
          </>
        ) : (
          <Hamburger />
        )}

        {/* {!collapsed && <Circle color="blue" onClick={handleToggleSidebar} />} */}
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
  );
};

export default SideBar;
