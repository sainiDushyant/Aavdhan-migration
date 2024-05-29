import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import MeterGeneratedAlert from './wrapper/meterGeneratedAlert';
import SystemGeneratedAlert from './wrapper/systemGeneratedAlert';

const AlertCard = (props) => {
  // Alerts Tab Selected
  const [active, setActive] = useState('1');

  // Meter Generated Alerts Filter option
  const [MGFilterOption, setMGFilterOption] = useState([
    {
      value: 'magnetic tamper',
      label: 'magnetic tamper',
      isFixed: 'true',
    },
    {
      value: 'cover open',
      label: 'cover open',
      isFixed: 'true',
    },
    {
      value: 'voltage fluctuation',
      label: 'voltage fluctuation',
      isFixed: 'true',
    },
  ]);

  // System Generated Alerts Filter option
  const [SGFilterOption, setSGFilterOption] = useState([
    {
      value: 'low credit balance',
      label: 'low credit balance',
      isFixed: 'true',
    },
    {
      value: 'recharge success',
      label: 'recharge success',
      isFixed: 'true',
    },
  ]);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  return (
    <Card className="card-developer-meetup">
      <CardHeader className="px-1 py-0 d-flex flex-column">
        {/* Header */}
        <h3 className="my-1 fw-bolder" style={{ color: '#5E5873' }}>
          Recent Alerts
        </h3>
        {/* Navigation tab */}
        <Nav className="m-0" tabs justified>
          <NavItem>
            <NavLink
              active={active === '1'}
              onClick={() => {
                toggle('1');
              }}
            >
              Meter generated
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '2'}
              onClick={() => {
                toggle('2');
              }}
            >
              System generated
            </NavLink>
          </NavItem>
        </Nav>
      </CardHeader>
      <CardBody className="p-0">
        <React.Fragment>
          <TabContent className="py-50" activeTab={active}>
            <TabPane tabId="1">
              <MeterGeneratedAlert
                hierarchy={props.hierarchy}
                height={props.height}
                loaderHeight={props.loaderHeight}
                MGFilterOption={MGFilterOption}
              />
            </TabPane>
            <TabPane tabId="2">
              <SystemGeneratedAlert
                hierarchy={props.hierarchy}
                height={props.height}
                loaderHeight={props.loaderHeight}
                SGFilterOption={SGFilterOption}
              />
            </TabPane>
          </TabContent>
        </React.Fragment>
      </CardBody>
    </Card>
  );
};

export default AlertCard;
