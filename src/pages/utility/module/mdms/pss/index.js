import { Row, Col } from 'reactstrap';

import '../../../../../@core/scss/react/libs/charts/apex-charts.scss';
// import '@styles/base/pages/dashboard-ecommerce.scss';
import '../../../../../@core/scss/base/pages/dashboard-ecommerce.scss';

//Wrapper Functions
import EnergyConsumptionWrapper from '../components/EnergyConsumptionInformationWrapper';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { updateMDMSHierarchyProgress } from '../../../../../app/redux/mdmsHeirarchySlice';
import OperationalInformationWrapper from '../components/OperationalInformationWrapper';

// import { Spinner, Card } from 'reactstrap'

const MdmsPssModule = (props) => {
  const location = useLocation();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const dispatch = useDispatch();

  const onSubstationTableRowClickHandler = (substation, row) => {
    dispatch(
      updateMDMSHierarchyProgress({
        pss_name: substation,
        pss_real_name: row.substation,
        project_name: project,
        mdms_state: 'feeder',
      })
    );

    //Move Forward to Feeder Level
    props.statehandler('feeder');

    //Update Hierarchy Progress
  };

  // const monthUpdated = useSelector(state => state.calendarReducer.monthUpdated)

  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col>
          <EnergyConsumptionWrapper
            statehandler={onSubstationTableRowClickHandler}
            changeState={props.statehandler}
            txtLen={16}
            tableName={'Substation Level'}
            hierarchy={'pss'}
          />
          {/* <Row className='match-height'>
            <UptimeWrapper hierarchy={'pss'} />
            <BillsGeneratedWrapper hierarchy={'pss'} />
          </Row> */}
        </Col>

        {/* <Col lg='4'>
          <Row className='match-height'>
            <TopAlertsWrapper hierarchy={'pss'} height='height-615' />
          </Row>
        </Col> */}
        <OperationalInformationWrapper hierarchy={'pss'} />
      </Row>
    </div>
  );
};

export default MdmsPssModule;
