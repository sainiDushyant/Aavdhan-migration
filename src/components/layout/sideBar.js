import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Circle } from 'react-feather';

const SideBar = ({ collapsed, toggleSidebar }) => {
  return (
    <Sidebar
      collapsed={collapsed}
      style={{ background: 'white', height: '100vh' }}
    >
      <div
        className="d-flex align-items-center gap-2"
        style={{ paddingLeft: '10px' }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.ico`}
          alt="Avdhaan Logo"
          onClick={toggleSidebar}
        />
        <span style={{ fontWeight: 'bold' }}>Avdhaan</span>
        {!collapsed && <Circle color="blue" onClick={toggleSidebar} />}
      </div>
      <Menu>
        <SubMenu label="Charts">
          <MenuItem>one</MenuItem>
          <MenuItem>two</MenuItem>
        </SubMenu>
        <MenuItem>Documentation</MenuItem>
        <MenuItem>Calendar</MenuItem>
        <MenuItem>E-commerce</MenuItem>
        <MenuItem>Examples</MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
