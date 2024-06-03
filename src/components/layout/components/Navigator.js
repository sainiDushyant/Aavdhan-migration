import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, Circle } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { setCollapsed } from '../../../app/redux/layoutSlice';
import '../../../styles/layout.scss';
import { Link } from 'react-router-dom';
import { setIsMobileSidebarOpen } from '../../../app/redux/layoutSlice';
function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.layout.collapsed);
  const toggleCollapsed = () => {
    dispatch(setCollapsed(!collapsed));
  };
  const isMobileSidebarOpen = useSelector(
    (state) => state.layout.isMobileSidebarOpen
  );

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
                  '&:hover': {
                    backgroundColor: '#7367f0',
                    color: 'white',
                  },
                };
            },
          }}
        >
          <SubMenu icon={<Award size={18} />} label="LPDD">
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/lpdd/hes')}
              active={location.pathname === '/utility/lpdd/hes'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              HES
            </MenuItem>
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/lpdd/mdms')}
              active={location.pathname === '/utility/lpdd/mdms'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              MDMS
            </MenuItem>
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/lpdd/sla-reports')}
              active={location.pathname === '/utility/lpdd/sla-reports'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              SLA REPORTS
            </MenuItem>
          </SubMenu>
          <SubMenu icon={<Award size={18} />} label="SBPDCL">
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/sbpdcl/hes')}
              active={location.pathname === '/utility/sbpdcl/hes'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              HES
            </MenuItem>
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/sbpdcl/mdms')}
              active={location.pathname === '/utility/sbpdcl/mdms'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              MDMS
            </MenuItem>
            <MenuItem
              icon={<Circle size={12} />}
              onClick={() => navigate('/utility/sbpdcl/sla-reports')}
              active={location.pathname === '/utility/sbpdcl/sla-reports'}
              data-bs-dismiss={isMobileSidebarOpen ? 'offcanvas' : ''}
            >
              SLA REPORTS
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
      <div className="d-none d-sm-flex" onClick={toggleCollapsed}>
        {collapsed === true ? (
          <ChevronRight
            className="cursor-pointer chevron-icon chevron-right"
            size={30}
          />
        ) : (
          <ChevronLeft
            className="cursor-pointer chevron-icon chevron-left "
            size={30}
          />
        )}
      </div>
    </div>
  );
}

export default SideBar;
