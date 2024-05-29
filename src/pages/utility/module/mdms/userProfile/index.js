import { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { ChevronLeft, Settings } from 'react-feather';

//Wrapper Functions

import AlertCard from '../../../../../components/ui-elements/gpCards/alertCardUpdated';

// import PeriodicWrapper from "./wrapper/periodicData"

// import BlockLoad from "@src/views/project/utility/module/mdms/userProfile/wrapper/blockLoad"
// import DailyLoad from "@src/views/project/utility/module/mdms/userProfile/wrapper/dailyLoad"
// import MonthlyBillDetermine from "@src/views/project/utility/module/mdms/userProfile/wrapper/monthlyBillDetermine"
import UserDetailWrapper from './wrapper/userDetailWrapper';
// import TotalRechargesWrapper from "./wrapper/totalRechargesWrapper"
// import CommandInfoTableWrapper from "./wrapper/commandInfoTableWrapper"
// import PrepaidLedgerWrapper from "./wrapper/prepaidLedgerWrapper"
import GeneratedBillsWrapper from './wrapper/generatedBillsWrapper';
// import MeterProfileConfig from "@src/views/project/utility/module/mdms/userProfile/wrapper/meterProfileConfig"

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useGetMDMSMeterConnectionStatusQuery } from '../../../../../api/mdms/userConsumptionSlice';

const MdmsUserConsumptionModule = (props) => {
  const location = useLocation();
  const project = location.pathname.split('/')[2];

  const [isOpen, setIsOpen] = useState(false);

  const [meterConnectionStatus, setMeterConnectionStatus] = useState('');

  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  const params = {
    project: project,
    sc_no: hierarchy.user_name,
    meter_address: hierarchy.meter_address,
    grid_id: hierarchy.grid_id,
  };
  const { data, isFetching, isError, status } =
    useGetMDMSMeterConnectionStatusQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setMeterConnectionStatus(data.data.result.stat.meterConnectionStatus);
      }
    }
  }, [data]);

  const onBackButtonClickHandler = () => {
    //Move back to DTRReset temper register
    props.updateMdmsState('user');
  };

  if (hierarchy.user_type === 'POSTPAID') {
    return (
      <div id="dashboard-ecommerce">
        <Row className="mb-1">
          <Col>
            {props.showBackButton && (
              <span
                onClick={onBackButtonClickHandler}
                className="cursor-pointer"
              >
                <ChevronLeft className="mb_3 anim_left" /> Back to User List
              </span>
            )}
          </Col>
          <Col className="text-center">
            <span>
              <span
                style={{ position: 'relative', fontSize: '16px', top: '-3px' }}
              >
                Meter status :{' '}
                {meterConnectionStatus ? (
                  meterConnectionStatus === 'Connected' ? (
                    <strong>Connected</strong>
                  ) : (
                    <strong>Disconnected</strong>
                  )
                ) : (
                  ''
                )}
              </span>{' '}
              {meterConnectionStatus ? (
                meterConnectionStatus === 'Connected' ? (
                  <div className="con_stat bg-success mt_5"></div>
                ) : (
                  <div className="con_stat bg-danger mt_5"></div>
                )
              ) : (
                <Spinner size="sm" className="mb_4" />
              )}
            </span>
          </Col>
          <Col>
            <span
              className="float-right mx-1 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Settings />
            </span>
          </Col>
        </Row>

        {/* New UI */}
        <Row className="match-height">
          <Col lg="7">
            <Row className="match-height">
              <Col md="6">
                <UserDetailWrapper hierarchy={'userProfile'} height="248px" />
              </Col>
              <Col md="6">
                {/* <TotalConsumptionWrapper hierarchy={"userProfile"} dvClas='py_10' /> */}
                <GeneratedBillsWrapper dvClas="py_10" />
              </Col>
              {/* <Col lg='6' xs='6'>
                <PeriodicWrapper />
              </Col> */}
              <Col lg="6" xs="6">
                {/* <BlockLoad /> need */}
              </Col>
              <Col lg="6" xs="6">
                {/* <DailyLoad />  need*/}
              </Col>
              <Col lg="12" md="12" xs="12">
                {/* <MonthlyBillDetermine /> need */}
              </Col>
            </Row>
          </Col>
          {/* <Col lg='4' md='6' className='px-0'>
            <Row>
              <UserDetailWrapper hierarchy={'userProfile'} />
            </Row>
          </Col>
          <Col lg='3' md='6' className='px-0'>
            <Row className='match-height px-1'>
              <TotalConsumptionWrapper hierarchy={'userProfile'} dvClas='py_10' />
              <GeneratedBillsWrapper dvClas='py_10' />
            </Row>
          </Col> */}
          <Col lg="5">
            {/* Change Hierarchy value to userProfile when API for user level alerts is created */}
            <AlertCard
              height="height-290"
              loaderHeight="height-550"
              hierarchy={'userProfile'}
            />
          </Col>
        </Row>

        {/* <Row>
          <PeriodicWrapper />
          <BlockLoad />
          <DailyLoad />
          <MonthlyBillDetermine />
        </Row> */}
        <Row>
          <Col>
            {/* <CommandInfoTableWrapper
              HierarchyProgress={props.HierarchyProgress}
              tableName={"Command info"}
              hierarchy={"user"}
              txtLen={20}
              length={"12"}
            /> need to uncomment */}
          </Col>
        </Row>

        {
          isOpen && ''
          // <MeterProfileConfig
          //   updateMdmsState={props.updateMdmsState}
          //   isOpen={isOpen}
          //   setIsOpen={setIsOpen}
          //   consumerType={hierarchy.user_type}
          //   title='Profile setting'
          // /> need to uncomment
        }
      </div>
    );
  } else {
    return (
      <div id="dashboard-ecommerce">
        <Row className="mb-1">
          <Col>
            {props.showBackButton && (
              <span
                onClick={onBackButtonClickHandler}
                className="cursor-pointer"
              >
                <ChevronLeft className="mb_3 anim_left" /> Back to User
              </span>
            )}
          </Col>
          <Col className="text-center">
            <span>
              <span
                style={{ position: 'relative', fontSize: '16px', top: '-3px' }}
              >
                Meter status :{' '}
                {meterConnectionStatus ? (
                  meterConnectionStatus === 'Connected' ? (
                    <strong>connected</strong>
                  ) : (
                    <strong>Disconnected</strong>
                  )
                ) : (
                  ''
                )}
              </span>{' '}
              {meterConnectionStatus ? (
                meterConnectionStatus === 'Connected' ? (
                  <div className="con_stat bg-success mt_5"></div>
                ) : (
                  <div className="con_stat bg-danger mt_5"></div>
                )
              ) : (
                <Spinner size="sm" className="mb_4" />
              )}
            </span>
          </Col>
          <Col>
            <span
              className="float-right mx-1 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Settings />
            </span>
          </Col>
        </Row>

        {/* New UI */}
        <Row className="match-height">
          <Col lg="7" className="px-0">
            {/* <Row className='match-height px-1'>
              <Col>
                <UserDetailWrapper hierarchy={'userProfile'} height='height-280' />
              </Col>
              <Col className='px-0'>
                <TotalConsumptionWrapper hierarchy={'userProfile'} />
                <TotalRechargesWrapper hierarchy={'userProfile'} />
              </Col>
            </Row>
            <Col>
              <PrepaidLedgerWrapper project={HierarchyProgress.project_name} />
            </Col> */}
            <Row className="match-height px-1">
              <Col>
                {/* <UserDetailWrapper hierarchy={"userProfile"} height='height-280' /> need to uncomment */}
              </Col>
              <Col>
                {/* <TotalConsumptionWrapper hierarchy={"userProfile"} /> */}
                {/* <TotalRechargesWrapper hierarchy={"userProfile"} /> need to uncomment */}
              </Col>
            </Row>
            <Row className="px-1">
              <Col>
                {/* <PrepaidLedgerWrapper project={hierarchy.project_name} /> uncomment */}
              </Col>
              <Col>{/* <GeneratedBillsWrapper uncomment /> */}</Col>
            </Row>
          </Col>
          <Col lg="5">
            {/* Change Hierarchy value to userProfile when API for user level alerts is created */}
            <AlertCard
              height="height-250"
              loaderHeight="height-400"
              hierarchy={'userProfile'}
            />
          </Col>
        </Row>

        <Row>
          <Col md="3" className="pr-0">
            {/* <PeriodicWrapper /> */}
          </Col>
          <Col md="3" className="pr-0">
            {/* <BlockLoad /> */}
          </Col>
          <Col md="3">{/* <DailyLoad /> */}</Col>
          <Col md="3" className="pl-0">
            {/* <MonthlyBillDetermine /> */}
          </Col>
        </Row>
        {/* <CommandInfoTableWrapper
          HierarchyProgress={props.HierarchyProgress}
          tableName={"Command info"}
          hierarchy={"user"}
          txtLen={12}
          length={"12"}
        /> */}

        {
          isOpen && ''
          // <MeterProfileConfig
          //   updateMdmsState={props.updateMdmsState}
          //   isOpen={isOpen}
          //   setIsOpen={setIsOpen}
          //   title='Profile setting'
          // />
        }
      </div>
    );
  }
};

export default MdmsUserConsumptionModule;
