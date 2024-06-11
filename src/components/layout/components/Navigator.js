import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCollapsed } from '../../../app/redux/layoutSlice';
import '../../../styles/layout.scss';
import { Award, Circle } from 'react-feather'; // Import necessary icons
import { routes } from '../../../pages/Routes';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.layout.collapsed);
  const isMobileSidebarOpen = useSelector(
    (state) => state.layout.isMobileSidebarOpen
  );

  const toggleCollapsed = () => {
    dispatch(setCollapsed(!collapsed));
  };

  return (
    <div className="pt-1">
      <Sidebar collapsed={collapsed}>
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 1)
                return {
                  color: active ? 'white' : undefined,
                  backgroundColor: active ? '#7367f0' : undefined,
                  '&:hover': {
                    backgroundColor: '#7367f0',
                    color: 'white',
                  },
                };
            },
          }}
        >
          {routes.map((route) => (
            <SubMenu
              key={route.key}
              icon={<Award size={18} />}
              label={route.title}
            >
              {route.modules.map((module) => (
                <MenuItem
                  key={module.key}
                  icon={<Circle size={12} />}
                  onClick={() => navigate(module.path)}
                  active={location.pathname === module.path}
                  data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
                >
                  {module.title}
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sidebar>
      <div className="d-none d-sm-flex" onClick={toggleCollapsed}>
        {collapsed ? (
          <ChevronRight
            className="cursor-pointer chevron-icon chevron-right"
            size={30}
          />
        ) : (
          <ChevronLeft
            className="cursor-pointer chevron-icon chevron-left"
            size={30}
          />
        )}
      </div>
    </div>
  );
}

export default SideBar;
