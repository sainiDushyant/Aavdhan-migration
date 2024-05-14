import React from 'react';

function Drawer({ SideBar }) {
  return (
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="drawer"
      aria-labelledby="drawerLabel"
    >
      <div
        class="offcanvas-header "
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          class="offcanvas-title d-flex flex-row align-items-center gap-1 pt-1"
          id="drawerLabel"
          style={{ flexWrap: 'nowrap' }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/logo.ico`}
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
            AVDHAAN
          </h3>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body p-0">
        <SideBar />
      </div>
    </div>
  );
}

export default Drawer;
