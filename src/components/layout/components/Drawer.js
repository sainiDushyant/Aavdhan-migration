import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileSidebarOpen } from '../../../app/redux/layoutSlice';
function Drawer({ SideBar }) {
  const dispatch = useDispatch();
  const isMobileSidebarOpen = useSelector(
    (state) => state.layout.isMobileSidebarOpen
  );

  const handleIsMobileSidebarOpen = () => {
    dispatch(setIsMobileSidebarOpen(false));
  };
  return (
    <div
      className={`offcanvas offcanvas-start`}
      tabIndex="-1"
      id="drawer"
      aria-labelledby="drawerLabel"
    >
      <div
        className="offcanvas-header "
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="offcanvas-title d-flex flex-row align-items-center gap-1 pt-1"
          id="drawerLabel"
          style={{ flexWrap: 'nowrap' }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/polaris-logo.svg`}
            alt="Avdhaan Logo"
            style={{
              width: '30px',
              height: '30px',
            }}
          />
          <h3
            style={{
              fontWeight: 'bold',
              color: '#61568F',
              margin: '0px',
              fontFamily: 'sans-serif',
            }}
          >
            Avdhaan
          </h3>
        </div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={handleIsMobileSidebarOpen}
        ></button>
      </div>
      <div className="offcanvas-body p-0">
        <SideBar />
      </div>
    </div>
  );
}

export default Drawer;
