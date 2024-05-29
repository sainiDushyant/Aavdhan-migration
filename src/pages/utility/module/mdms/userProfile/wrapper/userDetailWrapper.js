import UserDetailCard from '../../../../../../components/ui-elements/gpCards/userDetailNewCard';

import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import moment from 'moment';

import Loader from '../../../../../../components/loader/loader';

import { useLocation } from 'react-router-dom';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import { useGetUserPersonalInformationUpdatedQuery } from '../../../../../../api/mdms/userConsumptionSlice';

const UserDetailWrapper = (props) => {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );
  const currentMonth = moment().format('MM');
  const currentYear = moment().format('YYYY');
  const project = location.pathname.split('/')[2];
  const [response, setResponse] = useState([]);

  const params = {
    project: project,
    substation: HierarchyProgress.pss_name,
    feeder: HierarchyProgress.feeder_name,
    dtr: HierarchyProgress.dtr_name,
    sc_no: HierarchyProgress.user_name,
    year: currentYear,
    month: currentMonth,
  };

  const { data, isFetching, isError, status, refetch } =
    useGetUserPersonalInformationUpdatedQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setResponse(data.data.result.stat);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, status, isError]);

  const retryAgain = () => {
    refetch();
  };
  return (
    <div>
      {isError ? (
        <div>
          <CardInfo
            props={{
              message: { errorMessage },
              retryFun: { retryAgain },
              retry: { isFetching },
            }}
          />
        </div>
      ) : (
        <>
          {isFetching ? (
            <Loader height={props.height} />
          ) : response.hasOwnProperty('primaryInformation') ? (
            <UserDetailCard data={response} height={props.height} />
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
};

export default UserDetailWrapper;
