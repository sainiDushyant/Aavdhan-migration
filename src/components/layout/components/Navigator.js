import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Award } from 'react-feather';
function SideBar() {
  return (
    <div className="pt-1">
      <Sidebar>
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
    </div>
  );
}

export default SideBar;
