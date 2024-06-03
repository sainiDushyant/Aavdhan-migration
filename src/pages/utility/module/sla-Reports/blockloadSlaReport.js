import React, { useState, useEffect } from 'react';
import SlaFilter from './slaFilter';
import { Card, CardBody } from 'reactstrap';
import Loader from '../../../../components/loader/loader';
import { caseInsensitiveSort } from '../../../../utils';
import CardInfo from '../../../../components/ui-elements/cards/cardInfo';
import moment from 'moment';
import { useGetBlockLoadSLAQuery } from '../../../../api/sla-reports';
import DataTableV1 from '../../../../components/dtTable/DataTableV1';

const BlockloadSlaReport = () => {
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD'); // Yesterday, start of day
  const defaultEndDate = moment().startOf('day').format('YYYY-MM-DD'); // Today, start of day

  // Error Handling
  const [page, setpage] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState([]);
  const [appliedParams, setAppliedParams] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const params = { ...appliedParams };
  const { status, data, isError, isFetching, refetch } =
    useGetBlockLoadSLAQuery(params);
  useEffect(() => {
    if (status === 'fulfilled') {
      const res = data;
      const modifiedRes = res.map(({ slaAcheived, ...rest }) => ({
        ...rest,
        'slaAchieved(%)': slaAcheived,
      }));
      setResponse(modifiedRes);
      setErrorMessage('Something went wrong, please retry');
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [data]);

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
            {page * 10 + 1 + i}
          </div>
        );
      },
    });
    return column;
  };

  const retryAgain = () => {
    refetch();
  };

  const filterParams = (val) => {
    console.log(val, 'from daily load .....');
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
                  rowCount={10}
                  currentpage={page}
                  columns={tblColumn()}
                  data={response}
                  tableName={' BlockLoad SLA Report'}
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

export default BlockloadSlaReport;
