import React from 'react';
import SideBar from './sideBar';
import { Row, Col } from 'reactstrap';
import Footer from '../../@core/layouts/components/footer';

const LayoutWrapper = ({ children }) => {
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden',
  };
  return (
    <>
      <Row>
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col xs={9}>{children}</Col>
      </Row>
      <Footer footerType="static" footerClasses={footerClasses} />
    </>
  );
};

export default LayoutWrapper;
