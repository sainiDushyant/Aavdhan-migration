import React, { useState, useEffect } from 'react';
import SlaFilter from './slaFilter';
import { Card, CardBody } from 'reactstrap';
// import DataTabled from '../../../../ui-elements/dataTableUpdated';
import Loader from '../../../../components/loader/loader';
import { caseInsensitiveSort } from '../../../../utils';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
// import useJwt from '@src/auth/jwt/useJwt';
import moment from 'moment';
// import authLogout from '../../../../../auth/jwt/logoutlogic';
// import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { useGetDailyLoadSLAQuery } from '../../../../api/sla-reports';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSelectedModule } from '../../../../app/redux/previousSelectedModuleSlice';
import { slaReportsApi } from '../../../../api/sla-reports';

const DailyloadSlaReport = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD'); // Yesterday, start of day
  const defaultEndDate = moment().startOf('day').format('YYYY-MM-DD'); // Today, start of day
  // Error Handling
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState([]);
  const [appliedParams, setAppliedParams] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const project = location.pathname.split('/')[2];

  const currentSelectedModule = useSelector(
    (state) => state.currentSelectedModule
  );

  if (currentSelectedModule !== project) {
    dispatch(slaReportsApi.util.invalidateTags(['daily-load-sla']));
    dispatch(setCurrentSelectedModule(project));
  }

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
    refetch();
  };

  const params = { ...appliedParams };
  const { status, data, isError, isFetching, refetch } =
    useGetDailyLoadSLAQuery(params);

  useEffect(() => {
    if (status === 'fulfilled') {
      const res = data;
      const modifiedRes = res.map(({ slaAcheived, ...rest }) => ({
        ...rest,
        'slaAchieved(%)': slaAcheived,
      }));
      setResponse(modifiedRes);
      setErrorMessage('Something went wrong, please retry');
    } else if (isError) {
      setErrorMessage('Network Error, please retry');
    }
  }, [data, isError, status]);

  const tblColumn = () => {
    const column = [];
    const custom_width = ['create_time'];
    for (const i in response[0]) {
      const col_config = {};
      if (i !== 'id' && i !== 'site_id' && i !== 'year') {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        // col_config.width = '150px'
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        if (i === 'siteId') {
          col_config.width = '240px';
        } else {
          col_config.width = '240px';
        }
        col_config.cell = (row) => {
          return (
            <div className={`d-flex font-weight-bold w-100`}>
              <span
                className=""
                // data-tag='allowRowEvents'
                title={
                  row[i]
                    ? row[i]
                      ? row[i] !== ''
                        ? row[i].toString().length > 20
                          ? row[i]
                          : ''
                        : '-'
                      : '-'
                    : '-'
                }
              >
                {row[i] || row[i] === 0
                  ? (row[i] || row[i] === 0) && row[i] !== ''
                    ? row[i].toString().substring(0, 25)
                    : '-'
                  : '-'}
                {row[i] || row[i] === 0
                  ? (row[i] || row[i] === 0) && row[i] !== ''
                    ? row[i].toString().length > 25
                      ? '...'
                      : ''
                    : '-'
                  : '-'}
              </span>
            </div>
          );
        };
        column.push(col_config);
      }
    }
    column.unshift({
      name: 'Sr No.',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {pageSize * (page - 1) + 1 + i}
          </div>
        );
      },
    });
    return column;
  };
  const onNextPageClicked = (page) => {
    setPage(page + 1);
  };

  const retryAgain = () => {
    refetch();
  };

  const filterParams = (val) => {
    setAppliedParams(val);
  };
  return (
    <>
      <Card>
        <CardBody>
          <SlaFilter filterParams={filterParams} />

          {isFetching ? (
            <Loader hight="min-height-330" />
          ) : isError ? (
            <CardInfo
              props={{
                message: { errorMessage },
                retryFun: { retryAgain },
                retry: { isFetching },
              }}
            />
          ) : (
            !isFetching && (
              <div className="table-wrapper">
                <DataTableV1
                  rowCount={pageSize}
                  setRowCount={setRowCount}
                  currentPage={page}
                  columns={tblColumn()}
                  data={response}
                  totalRowsCount={data?.length}
                  tableName={' Dailyload SLA Report'}
                  onPageChange={onNextPageClicked}
                  showDownloadButton={true}
                  showRefreshButton={true}
                  refreshFn={refetch}
                  isLoading={isFetching}
                  pointerOnHover={true}
                />
              </div>
            )
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default DailyloadSlaReport;
