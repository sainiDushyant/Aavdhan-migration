import { Row, Col } from 'reactstrap';

import EnergyConsumptionWrapper from '../components/EnergyConsumptionInformationWrapper';
import OperationalInformationWrapper from '../components/OperationalInformationWrapper';

import { useSelector, useDispatch } from 'react-redux';

import { updateMDMSHierarchyProgress } from '../../../../../app/redux/mdmsHeirarchySlice';

import { ChevronLeft } from 'react-feather';

import DailyLoadWrapper from './wrapper/dailyLoadData';
import BlockLoadWrapper from './wrapper/blockLoadData';
import BillingHistoryWrapper from './wrapper/billingHistoryData';

const AllUsers = (props) => {
  const dispatch = useDispatch();
  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  const onUserTableRowClickHandler = (user, row) => {
    props.updateMdmsState('user_profile');
    props.updateConnectionType(row.connection_type);

    //Update Hierarchy Progress
    dispatch(
      updateMDMSHierarchyProgress({
        ...hierarchy,
        user_name: user,
        user_type: row.connection_type,
        meter_serial_number: row.meter_number,
        // mdms_state: 'userConsumption',
        mdms_state: 'user_profile',
        meter_address: row.meter_address,
        grid_id: row.grid_id,
        meter_protocol_type: row.meter_protocol_type.toLowerCase(),
      })
    );
  };

  const onBackButtonClickHandler = () => {
    props.updateMdmsState('dtr');
  };

  return (
    <div className="h-100 w-100">
      {props.showBackButton && (
        <span onClick={onBackButtonClickHandler} className="cursor-pointer">
          <ChevronLeft className="mb_3 anim_left" /> Back to DTR List
        </span>
      )}
      <Row className="match-height">
        <Col md="12">
          <EnergyConsumptionWrapper
            statehandler={onUserTableRowClickHandler}
            changeState={props.updateMdmsState}
            txtLen={12}
            tableName={`User Level (${hierarchy.dtr_real_name})`}
            height={true}
            hierarchy={'user'}
          />
        </Col>

        <Col xs="12">
          <Row className="match-height">
            <Col lg="4" xs="6" className="pl-0">
              <DailyLoadWrapper />
            </Col>
            <Col lg="4" xs="6" className="pl-0">
              <BlockLoadWrapper />
            </Col>
            <Col lg="4" xs="6" className="pl-0">
              <BillingHistoryWrapper />
            </Col>
            <OperationalInformationWrapper
              // height="height-367"
              hierarchy={'user'}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AllUsers;
