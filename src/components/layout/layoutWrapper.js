import React from 'react';
import SideBar from './sideBar';
import { Row, Col } from 'reactstrap';
import Footer from '../../@core/layouts/components/footer';

const LayoutWrapper = ({ children }) => {
  return (
    <>
      <Row>
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col xs={9}>{children}</Col>
      </Row>
      <Footer />
    </>
  );
};

export default LayoutWrapper;
