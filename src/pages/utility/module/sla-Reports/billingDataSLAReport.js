import React, { useState, useEffect } from 'react';
import SlaFilter from './slaFilter';
import { Card, CardBody } from 'reactstrap';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';
import Loader from '../../../../components/loader/loader';
import { caseInsensitiveSort } from '../../../../utils';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import moment from 'moment';
import { useGetBillingHistorySLAQuery } from '../../../../api/sla-reports';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSelectedModule } from '../../../../app/redux/previousSelectedModuleSlice';
import { slaReportsApi } from '../../../../api/sla-reports';

const BillingDataSLAReport = () => {
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
    dispatch(slaReportsApi.util.invalidateTags(['billing-sla']));
    dispatch(setCurrentSelectedModule(project));
  }

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
    refetch();
  };

  const params = { ...appliedParams };
  const { data, status, isError, isFetching, refetch } =
    useGetBillingHistorySLAQuery(params);

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
  }, [data, status, isError]);

  const tblColumn = () => {
    const column = [];
    const custom_width = ['create_time'];
    for (const i in response[0]) {
      const col_config = {};
      if (i !== 'id' && i !== 'site_id' && i !== 'year') {
        col_config.name = i
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before uppercase letter that is preceded by a lowercase letter
          .replace(/_/g, ' ') // Replace underscores with spaces
          .split(' ') // Split the string into words
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        col_config.width = '240px'; // Default width for columns
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

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
                  tableName={'Billing SLA Report'}
                  totalRowsCount={data?.length}
                  onPageChange={onNextPageClicked}
                  showDownloadButton={true}
                  showRefreshButton={true}
                  showAddButton={false}
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

export default BillingDataSLAReport;
