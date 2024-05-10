import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Circle, Award } from 'react-feather';

const SideBar = ({ collapsed, toggleSidebar }) => {
  return (
    <Sidebar
      collapsed={collapsed}
      style={{ background: '#ffffff', height: '100vh', overflowX: 'hidden' }}
      onMouseEnter={() => collapsed && toggleSidebar()}
    >
      <div
        className="d-flex align-items-center gap-2"
        style={{ paddingLeft: '10px', paddingTop: '20px' }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.ico`}
          alt="Avdhaan Logo"
          onClick={toggleSidebar}
        />
        <h1 style={{ fontWeight: 'bold' }}>Avdhaan</h1>
        {/* {!collapsed && <Circle color="blue" onClick={toggleSidebar} />} */}
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
