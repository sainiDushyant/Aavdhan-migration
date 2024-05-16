import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card } from 'reactstrap';
import Blockloaddata from './BlockLoadData';
import PushEventData from './PushEventData';
import BillingData from './BillingData';

const PushData = () => {
  const [active, setActive] = useState('1');

  const toggle = (tab) => {
    setActive(tab);
  };

  return (
    <React.Fragment>
      <Card className="pb-0 pt-1">
        <Nav pills fill className="px-1">
          <NavItem>
            <NavLink
              active={active === '1'}
              onClick={() => {
                toggle('1');
              }}
            >
              Block Load Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '2'}
              onClick={() => {
                toggle('2');
              }}
            >
              Push Event Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '4'}
              onClick={() => {
                toggle('3');
              }}
            >
              Billing Data
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="py-50" activeTab={active}>
          <TabPane tabId="1">
            {active === '1' && <Blockloaddata setActive={setActive} />}
          </TabPane>
          <TabPane tabId="2">{active === '2' && <PushEventData />}</TabPane>
          <TabPane tabId="4">{active === '3' && <BillingData />}</TabPane>
        </TabContent>
      </Card>
    </React.Fragment>
  );
};

export default PushData;
