import React, { useState, Fragment, useEffect } from 'react';
import Avatar from '../../../../@core/components/avatar';
import { Spinner, Row, Col, Button } from 'reactstrap';
import { Bell, RefreshCw } from 'react-feather';
import Loader from '../../../loader/loader';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import EventHistoryModal from '../../../../pages/utility/module/mdms/userProfile/wrapper/eventHistoryModal';

import CardInfo from '../../cards/cardInfo';

import { useGetAssetHierarchyWiseMeterAlertsQuery } from '../../../../api/mdms/userConsumptionSlice';

const MeterGeneratedAlert = (props) => {
  const location = useLocation();
  const project = location.pathname.split('/')[2];

  const [response, setResponse] = useState([]);
  const [explore, setExplore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  // if (response && response.responseData) {
  //   // Remove events with only time and no events
  //   const temp = response.responseData;
  //   responseData = temp.filter(function (item) {
  //     return item.event_message.length > 0;
  //   });
  // } else {
  //   responseData = [];
  // }

  // console.log('Meter Generated Alerts Response Data ...')
  // console.log(responseData)

  // const dummyData = []

  const getParams = () => {
    let params;
    if (props.hierarchy === 'userProfile') {
      params = {
        meter: hierarchy.meter_serial_number,
        project: project,
        is_mdms: true,
      };
    }
    return params;
  };

  const { isFetching, data, status, isError, refetch } =
    useGetAssetHierarchyWiseMeterAlertsQuery(getParams());

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setResponse(data.data.result.results);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data]);

  const refreshAlerts = () => {
    refetch();
  };

  const getDateFunction = (params) => {
    const dateObject = new Date(params);
    return ''.concat(
      dateObject.getDate(),
      '-',
      dateObject.getMonth() + 1,
      '-',
      dateObject.getFullYear()
    );
  };

  const getTimeFunction = (params) => {
    const dateObject = new Date(params);
    return ''.concat(
      dateObject.getHours(),
      ':',
      dateObject.getMinutes(),
      ':',
      dateObject.getSeconds()
    );
  };

  const retryAgain = () => {
    refetch();
  };

  if (isError) {
    return (
      <Col xl="12" md="6" xs="12" className="mt-3 ">
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { isFetching },
          }}
        />
      </Col>
    );
  } else if (!isFetching) {
    if (response.length > 0) {
      return (
        <div>
          <Row className="mb-1">
            <Col className="pl_30">
              {/* Filter dropdown */}
              {/* <Select
              isClearable={true}
              closeMenuOnSelect={true}
              onChange={onFilterOptionSelected}
              isSearchable={true}
              options={props.MGFilterOption}
              className='react-select border-secondary rounded'
              classNamePrefix='select'
              placeholder='Select Filter ...'
            /> */}
            </Col>
            <Col className="col-md-2 pr-3">
              {/* Refresh Icon */}
              <Fragment>
                {isFetching ? (
                  <Spinner
                    id="refresh_table"
                    size="sm"
                    className="mt_10 float-right"
                  />
                ) : (
                  <RefreshCw
                    id="refresh_table"
                    size="14"
                    className="mt_10 float-right"
                    onClick={refreshAlerts}
                  />
                )}
                {/* <Tooltip placement='top' isOpen={refreshTooltipOpen} target='refresh_table' toggle={() => setRefreshTooltipOpen(!refreshTooltipOpen)}>
                Refresh Table
              </Tooltip> */}
              </Fragment>
            </Col>
          </Row>
          <Col className={`${props.height} webi_scroller`}>
            {response.map((value, index) => {
              return (
                <Row key={index} className="border-top py_10">
                  <Col className="col-3 border-right super-center">
                    <div>
                      <Avatar
                        className="rounded"
                        color="light-primary"
                        icon={<Bell size={18} />}
                      />{' '}
                      <br></br>
                      <p className="super_small m-0">
                        {getDateFunction(value.meter_time)}
                      </p>
                      <p
                        className="super_small m-0"
                        style={{ lineHeight: '1' }}
                      >
                        {getTimeFunction(value.meter_time)}
                      </p>
                    </div>
                  </Col>
                  <Col>
                    {value.event_message.map((val, ind) => {
                      return (
                        <p className="m-0" key={ind}>
                          <small>
                            {ind + 1}. {val.message}
                          </small>
                        </p>
                      );
                    })}
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col className="text-center border-top pt_7">
            <Button size="sm" outline onClick={() => setExplore(true)}>
              Explore more
            </Button>
          </Col>

          {explore && (
            <EventHistoryModal
              title={'Event history table'}
              isOpen={explore}
              txtLen={50}
              handleModalState={setExplore}
            />
          )}
        </div>
      );
    } else {
      return (
        <div>
          <Row className="mb-1">
            <Col className="pl_30"></Col>
            <Col className="col-md-2 pr-3">
              {/* Refresh Icon */}
              <Fragment>
                {isFetching ? (
                  <Spinner
                    id="refresh_table"
                    size="sm"
                    className="mt_10 float-right"
                  />
                ) : (
                  <RefreshCw
                    id="refresh_table"
                    size="14"
                    className="mt_10 float-right"
                    onClick={refreshAlerts}
                  />
                )}
              </Fragment>
            </Col>
          </Row>
          <div className="super-center alert_dv">
            <div>
              <img
                src={'no_data.svg'}
                style={{ height: '150px', width: '150px' }}
              />
              <p className="mt-1 ml-3">No data found</p>
              <Button
                size="sm"
                color="flat-primary"
                className="ml-3"
                onClick={() => setExplore(true)}
              >
                Explore more
              </Button>
              {explore && (
                <EventHistoryModal
                  title={'Event history table'}
                  isOpen={explore}
                  txtLen={50}
                  handleModalState={setExplore}
                />
              )}
            </div>
          </div>
        </div>
      );
    }
  } else if (isFetching) {
    return (
      <div className="super-center alert_dv">
        <Loader />
      </div>
    );
  }
};

export default MeterGeneratedAlert;
