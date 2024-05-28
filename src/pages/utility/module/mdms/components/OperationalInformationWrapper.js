import CardinlineMultiData from '../../../../../components/ui-elements/statistics/cardinlineMultiData';
import { Row, Col, Card } from 'reactstrap';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../../components/loader/loader';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import CardInfo from '../../../../../components/ui-elements/cards/cardInfo';

import {
  useGetOperationalStatisticsEnergyQuery,
  useGetOperationalStatisticsMeterCountQuery,
  useGetOperationalStatisticsRechargesQuery,
} from '../../../../../api/mdms/operational-statisticsSlice';

const OperationalInformationWrapper = (props) => {
  const location = useLocation();
  const [energyData, setEnergyData] = useState([]);
  const [rechargeData, setRechargeData] = useState([]);
  const [metersData, setMetersData] = useState([]);
  const currentMonth = moment().format('MM'); // Month number, e.g., "05"
  const currentYear = moment().format('YYYY');

  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);
  const project = location.pathname.split('/')[2];

  const getParams = () => {
    let params;
    if (props.hierarchy === 'pss') {
      params = {
        project: project,
        year: currentYear,
        month: currentMonth,
      };
    } else if (props.hierarchy === 'feeder') {
      params = {
        project: project,
        substation: hierarchy.pss_name,
        year: currentYear,
        month: currentMonth,
      };
    } else if (props.hierarchy === 'dtr') {
      params = {
        project: project,
        substation: hierarchy.pss_name,
        feeder: hierarchy.feeder_name,
        year: currentYear,
        month: currentMonth,
      };
    } else if (props.hierarchy === 'user') {
      params = {
        project: project,
        substation: hierarchy.pss_name,
        feeder: hierarchy.feeder_name,
        dtr: hierarchy.dtr_name,
        year: currentYear,
        month: currentMonth,
      };
    }
    return params;
  };

  const {
    isFetching: opsSatsEnergyLoading,
    isError: opsStatsEnergyError,
    data: opsStatsEnergyData,
    status: opsStatsEnergyStatus,
    refetch: fetchEnergydata,
  } = useGetOperationalStatisticsEnergyQuery(getParams());
  const {
    isFetching: opsSatsRechargeLoading,
    isError: opsStatsRechargeError,
    data: opsStatsRechargeData,
    status: opsStatsRechargeStatus,
    refetch: fetchRechargeData,
  } = useGetOperationalStatisticsRechargesQuery(getParams());
  const {
    isFetching: opsSatsMetersLoading,
    isError: opsStatsMetersError,
    data: opsStatsMetersData,
    status: opsStatsMetersStatus,
    refetch: fetchMetersData,
  } = useGetOperationalStatisticsMeterCountQuery(getParams());

  useEffect(() => {
    if (opsStatsEnergyStatus === 'fulfilled') {
      let statusCode = opsStatsEnergyData.responseCode;
      if (statusCode === 200) {
        setEnergyData(opsStatsEnergyData.data.result.stat);
      }
    }
  }, [opsStatsEnergyData]);

  useEffect(() => {
    if (opsStatsRechargeStatus === 'fulfilled') {
      let statusCode = opsStatsRechargeData.responseCode;
      if (statusCode === 200) {
        setRechargeData(opsStatsRechargeData.data.result.stat);
      }
    }
  }, [opsStatsRechargeData]);

  useEffect(() => {
    if (opsStatsMetersStatus === 'fulfilled') {
      let statusCode = opsStatsMetersData.responseCode;
      if (statusCode === 200) {
        setMetersData(opsStatsMetersData.data.result.stat);
      }
    }
  }, [opsStatsMetersData]);

  const response = [...energyData, ...rechargeData, ...metersData];

  useEffect(() => {
    try {
      props.setHeight(document.getElementById('getHeight').clientHeight);
    } catch (err) {}
  });

  const retryAgain = () => {
    if (opsStatsEnergyError && opsStatsRechargeError && opsStatsMetersError) {
      fetchEnergydata();
      fetchRechargeData();
      fetchMetersData();
      return;
    }
    if (opsStatsEnergyError) {
      fetchEnergydata();
    } else if (opsStatsRechargeError) {
      fetchRechargeData();
    } else if (opsStatsMetersError) {
      fetchMetersData();
    }
  };

  return (
    <Col lg="12" id="getHeight">
      {opsStatsEnergyError || opsStatsRechargeError || opsStatsMetersError ? (
        <CardInfo
          props={{
            message: { errorMessage: 'Something went wrong...' },
            retryFun: { retryAgain },
            retry: {
              retry:
                opsSatsEnergyLoading ||
                opsSatsMetersLoading ||
                opsSatsRechargeLoading,
            },
          }}
        />
      ) : (
        <>
          {opsSatsEnergyLoading ||
          opsSatsRechargeLoading ||
          opsSatsMetersLoading ? (
            <Loader hight={props.height ? props.height : 'min-height-176'} />
          ) : (
            <CardinlineMultiData
              cols={props.cols ? props.cols : { xl: '3', md: '4', sm: '6' }}
              data={response}
            />
          )}
        </>
      )}
    </Col>
  );
};

export default OperationalInformationWrapper;
