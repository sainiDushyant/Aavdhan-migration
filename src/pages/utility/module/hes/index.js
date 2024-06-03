import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
// import MeterAndCommandDropDown from './wrappers/meterAndCommandDropdown';
import CommandHistory from './components/command-history/CommandHistory';
import PushData from './components/push-data/PushData.js';
//import MeterProfile from './components/MeterProfile.js';
import MeterAndCommandDropDown from './components/meter-and-command-dropdown/commandExecuReplica/meterAndCommandDropdown';
import MeterConfigData from './components/meter-configuration/meterConfigData';

const HesUtility = () => {
  const [protocol, setProtocol] = useState('dlms');
  const [active, setActive] = useState('1');

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const protocolSelectedForCommandExecution = (val) => {
    setProtocol(val);
  };
  return (
    <div>
      <Nav tabs justified className="cursor-pointer">
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1');
            }}
          >
            Pull Data
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2');
            }}
          >
            Push Data
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3');
            }}
          >
            Meter Configuration
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          {active === '1' && (
            <React.Fragment>
              <MeterAndCommandDropDown
                protocolSelectedForCommandExecution={
                  protocolSelectedForCommandExecution
                }
              />
              <CommandHistory
                protocol={protocol}
                protocolSelectionOption={true}
                protocolSelectedForCommandExecution={
                  protocolSelectedForCommandExecution
                }
                txtLen={12}
                setActive={setActive}
                activeTab={active}
              />
            </React.Fragment>
          )}
        </TabPane>
        <TabPane tabId="2">
          {active === '2' && <PushData setActive={setActive} />}
        </TabPane>
        <TabPane tabId="3">
          {active === '3' && <MeterConfigData setActive={setActive} />}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default HesUtility;
