import { useState } from 'react';

import classnames from 'classnames';
import { ChevronUp } from 'react-feather';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Collapse,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

import OfflineRecharge from './meterProfileConfig/offlineRecharge';
import OtherMiscConfig from './meterProfileConfig/otherMiscConfig';
import RelaySetting from './meterProfileConfig/relaysetting';
import SwitchMeterMode from './meterProfileConfig/switchMeterMode';

const MeterProfileConfig = (props) => {
  let data = [];

  if (props.consumerType === 'POSTPAID') {
    data = [
      {
        title: 'Other MISC. configuration',
        content: <OtherMiscConfig />,
      },
      {
        title: 'Switch Meter Mode',
        content: (
          <SwitchMeterMode
            updateMdmsState={props.updateMdmsState}
            consumerType={props.consumerType}
            setIsOpen={props.setIsOpen}
            isOpen={props.isOpen}
          />
        ),
      },
    ];
  } else {
    data = [
      {
        title: 'Relay Disconnection Condition',
        content: (
          <RelaySetting setIsOpen={props.setIsOpen} isOpen={props.isOpen} />
        ),
      },
      {
        title: 'Offline recharge',
        content: (
          <OfflineRecharge setIsOpen={props.setIsOpen} isOpen={props.isOpen} />
        ),
      },
      {
        title: 'Other MISC. configuration',
        content: <OtherMiscConfig />,
      },
      {
        title: 'Switch Meter Mode',
        content: (
          <SwitchMeterMode
            updateMdmsState={props.updateMdmsState}
            consumerType={props.consumerType}
            setIsOpen={props.setIsOpen}
            isOpen={props.isOpen}
          />
        ),
      },
    ];
  }

  const [openCollapse, setOpenCollapse] = useState();

  const handleCollapseToggle = (id) => {
    if (id === openCollapse) {
      setOpenCollapse(null);
    } else {
      setOpenCollapse(id);
    }
  };

  // ** Function to render collapse
  const renderData = () => {
    return (
      <Card className="app-collapse">
        <CardBody>
          {data.map((item, index) => {
            return (
              <div
                className={classnames('app-collapse', 'border-bottom', {
                  open: openCollapse === index,
                })}
                key={index}
              >
                <CardHeader
                  className={classnames(
                    'align-items-center',
                    'font-weight-bolder',
                    'cursor-pointer',
                    {
                      collapsed: openCollapse !== index,
                    }
                  )}
                  onClick={() => handleCollapseToggle(index)}
                >
                  <div className="collapse-title">{item.title}</div>
                  <ChevronUp size={14} />
                </CardHeader>
                <Collapse isOpen={openCollapse === index}>
                  <div className="px-2 pb-1">{item.content}</div>
                </Collapse>
              </div>
            );
          })}
        </CardBody>
      </Card>
    );
  };

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.setIsOpen(!props.isOpen)}
      scrollable
      className="modal_size"
    >
      <ModalHeader toggle={() => props.setIsOpen(!props.isOpen)}>
        {props.title}
      </ModalHeader>
      <ModalBody className="webi_scroller">{renderData()}</ModalBody>
    </Modal>
  );
};

export default MeterProfileConfig;
