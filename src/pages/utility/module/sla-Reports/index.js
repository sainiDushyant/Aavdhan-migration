import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import BlockloadSlaReport from './blockloadSlaReport';
import DailyloadSlaReport from './dailyloadSlaReport';
import BillingDataSLAReport from './billingDataSLAReport';
// import RCDCSLAReport from './rcdcSLAReport';

const SLA_Reports = () => {
  const [active, setActive] = useState('1');

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <React.Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1');
            }}
          >
            BlockLoad SLA
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2');
            }}
          >
            DailyLoad SLA
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3');
            }}
          >
            Billing SLA
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4');
            }}
          >
            RC/DC SLA
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">{active === '1' && <BlockloadSlaReport />}</TabPane>
        <TabPane tabId="2">{active === '2' && <DailyloadSlaReport />}</TabPane>
        <TabPane tabId="3">
          {active === '3' && <BillingDataSLAReport />}
        </TabPane>
        {/* <TabPane tabId="4"> */}
        {/* {active === '4' && <RCDCSLAReport />} */}
        {/* </TabPane> */}
      </TabContent>
    </React.Fragment>
  );
};

export default SLA_Reports;
