import { Row, Col } from 'reactstrap';

import '../../../../../@core/scss/react/libs/charts/apex-charts.scss';
// import '@styles/base/pages/dashboard-ecommerce.scss';

//Wrapper Functions
import EnergyConsumptionWrapper from '../components/EnergyConsumptionInformationWrapper';

import OperationalInformationWrapper from '../components/OperationalInformationWrapper';

import { useDispatch, useSelector } from 'react-redux';

import { ChevronLeft } from 'react-feather';
import { updateMDMSHierarchyProgress } from '../../../../../app/redux/mdmsHeirarchySlice';

const MdmsDtrModule = (props) => {
  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  const dispatch = useDispatch();

  const onDtrTableRowClickHandler = (dtr, row) => {
    // console.log("DTR Row Clicked ...")
    // console.log(row)

    //Move to user level
    props.statehandler('user');

    //Update Hierarchy Progress
    dispatch(
      updateMDMSHierarchyProgress({
        ...hierarchy,
        dtr_name: dtr,
        dtr_real_name: row.dtr,
        mdms_state: 'user',
      })
    );
  };

  const onBackButtonClickHandler = () => {
    //Move back to feeder level
    props.statehandler('feeder');
  };

  return (
    <div id="dashboard-ecommerce">
      <span onClick={onBackButtonClickHandler} className="cursor-pointer">
        <ChevronLeft className="mb_3 anim_left" /> Back to feeder
      </span>
      <Row className="match-height">
        <Col>
          <EnergyConsumptionWrapper
            statehandler={onDtrTableRowClickHandler}
            changeState={props.statehandler}
            txtLen={27}
            tableName={'DTR Level'}
            hierarchy={'dtr'}
          />
          {/* <Row className='match-height'>
            <UptimeWrapper hierarchy={'dtr'} />

            <BillsGeneratedWrapper hierarchy={'dtr'} />
          </Row> */}
        </Col>

        {/* <Col md='4'>
          <Row className='match-height'>
            <TopAlertsWrapper hierarchy={'dtr'} height='height-595' />
          </Row>
        </Col> */}
        <OperationalInformationWrapper hierarchy={'dtr'} />
      </Row>
    </div>
  );
};

export default MdmsDtrModule;
