import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useLocation } from 'react-router-dom';
import { Award } from 'react-feather';
import '../../../styles/layout.scss';
import { Link } from 'react-router-dom';
function SideBar({ collapsed, setCollapsed }) {
  const location = useLocation();
  return (
    <div className="pt-1">
      <Sidebar collapsed={collapsed}>
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              // only apply styles on first level elements of the tree
              if (level === 1)
                return {
                  color: active ? 'white' : undefined,
                  backgroundColor: active ? '#7367f0' : undefined,
                };
            },
          }}
        >
          <SubMenu icon={<Award size={18} />} label="LPDD">
            <MenuItem
              icon={<Award size={18} />}
              component={<Link to={'/utility/lpdd/hes'} />}
              active={location.pathname === '/utility/lpdd/hes'}
            >
              HES
            </MenuItem>
          </SubMenu>
          <SubMenu icon={<Award size={18} />} label="SBPDCL">
            <MenuItem
              icon={<Award size={18} />}
              component={<Link to={'/utility/sbpdcl/hes'} />}
              active={location.pathname === '/utility/sbpdcl/hes'}
            >
              HES
            </MenuItem>
          </SubMenu>
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
