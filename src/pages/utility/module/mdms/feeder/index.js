import { Row, Col } from 'reactstrap';

import '../../../../../@core/scss/react/libs/charts/apex-charts.scss';

//Wrapper Functions
import EnergyConsumptionWrapper from '../components/EnergyConsumptionInformationWrapper';
import OperationalInformationWrapper from '../components/OperationalInformationWrapper';

import { useSelector, useDispatch } from 'react-redux';

import { ChevronLeft } from 'react-feather';
import { updateMDMSHierarchyProgress } from '../../../../../app/redux/mdmsHeirarchySlice';

const MdmsFeederModule = (props) => {
  const dispatch = useDispatch();
  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  const onFeederTableRowClickHandler = (feeder, row) => {
    //Move to DTR Level
    props.statehandler('dtr');

    //Update Hierarchy Progress
    dispatch(
      updateMDMSHierarchyProgress({
        ...hierarchy,
        feeder_name: feeder,
        feeder_real_name: row.feeder,
        mdms_state: 'dtr',
      })
    );
  };

  const onBackButtonClickHandler = () => {
    //Move back to pss level
    props.statehandler('pss');

    //Clear all feeder data from redux store

    //Clear feeder name from hierarchy progress
  };

  return (
    <div id="dashboard-ecommerce">
      <span onClick={onBackButtonClickHandler} className="cursor-pointer">
        <ChevronLeft className="mb_3 anim_left" /> Back to substation
      </span>
      <Row className="match-height">
        <Col>
          <EnergyConsumptionWrapper
            statehandler={onFeederTableRowClickHandler}
            txtLen={17}
            tableName={'Feeder Level'}
            hierarchy={'feeder'}
          />
          {/* <Row className='match-height'>
            <UptimeWrapper hierarchy={'feeder'} />

            <BillsGeneratedWrapper hierarchy={'feeder'} />
          </Row> */}
        </Col>
        {/* <Col md='4'>
          <Row className='match-height'>
            <TopAlertsWrapper hierarchy={'feeder'} height='height-595' />
          </Row>
        </Col> */}
        <OperationalInformationWrapper hierarchy={'feeder'} />
      </Row>
    </div>
  );
};

export default MdmsFeederModule;
