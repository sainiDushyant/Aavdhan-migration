import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Award } from 'react-feather';
import '../../../styles/layout.scss';
function SideBar({ collapsed, setCollapsed }) {
  return (
    <div className="pt-1">
      <Sidebar collapsed={collapsed}>
        <Menu>
          <SubMenu icon={<Award size={18} />} label="Charts">
            <MenuItem icon={<Award size={18} />}>one</MenuItem>
            <MenuItem icon={<Award size={18} />}>two</MenuItem>
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
      {collapsed ? (
        <ChevronRight
          onClick={() => setCollapsed(false)}
          className="cursor-pointer chevron-icon chevron-right sb-button"
          size={30}
        />
      ) : (
        <ChevronLeft
          onClick={() => setCollapsed(true)}
          className="cursor-pointer chevron-icon chevron-left sb-button"
          size={30}
        />
      )}
    </div>
  );
}

export default SideBar;
