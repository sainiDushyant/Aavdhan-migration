import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        bottom: 10,
        width: '100%',
        marginLeft: '15px',
      }}
    >
      <p
        className="mb-0"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '10px',
        }}
      >
        <span className="float-md-left d-block d-md-inline-block mt-25">
          COPYRIGHT © {new Date().getFullYear()}{' '}
          <a
            href="https://polarisgrids.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polaris
          </a>
          <span className="d-none d-sm-inline-block">
            , All rights Reserved
          </span>
        </span>

        <small>
          Version : HES - <span className="text-dark">1.2</span> | MDMS -{' '}
          <span className="text-dark">0.0.0.5</span> | Billing System -{' '}
          <span className="text-dark">0.0.0.5</span> | CIS/CRM -
          <span className="text-dark">1.9.3</span>
        </small>
        {/* <span className='float-md-right d-none d-md-block'>
          Made with
          <Heart size={14} />
        </span> */}
      </p>
    </footer>
  );
};

export default Footer;
