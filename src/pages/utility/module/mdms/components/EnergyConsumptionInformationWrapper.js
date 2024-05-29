import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../../components/loader/loader';

import CardInfo from '../../../../../components/ui-elements/cards/cardInfo';
import { Badge } from 'reactstrap';
import moment from 'moment';

import DataTableV1 from '../../../../../components/dtTable/DataTableV1';

import { useGetAssetsenergyConsumptionQuery } from '../../../../../api/mdms/energy-consumptionSlice';

//let tbData = []

const EnergyConsumptionWrapper = (props) => {
  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setError] = useState(false);
  const [retry, setRetry] = useState(false);

  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [response, setResponse] = useState([]);

  const project = location.pathname.split('/')[2];

  const currentMonth = moment().format('MM'); // Month number, e.g., "05"
  const currentYear = moment().format('YYYY');

  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  // if (response) {
  //   if (response.length > 0 &&response[0].hasOwnProperty('wallet_balance')) {
  //     // console.log("Inside If Condition")

  //    let responseData = []

  //     for (const ele of response.responseData) {
  //       const wallet_balance = Number(ele['wallet_balance'])
  //       // console.log(wallet_balance)
  //       // console.log(ele)
  //       const temp = {
  //         ...ele,
  //         wallet_balance
  //       }

  //       responseData.push(temp)
  //     }
  //   } else {
  //     // console.log("Insie Else Condition")

  //     responseData = response.responseData
  //   }
  // } else {
  //   responseData = []
  // }
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

  const { data, isFetching, isError, status, refetch } =
    useGetAssetsenergyConsumptionQuery(getParams());

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        setResponse(data.data.result.stat);
      }
    }
  }, [data]);

  const onPageChange = (page) => {
    setCurrentPage(page + 1);
  };

  // Check the column length
  // const handle_row_element_length = (props) => {
  //   for (const i of responseData) {
  //     if (i[props].length > 25) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const handleRowClick = (data) => {
    props.statehandler(data.id, data);
  };

  const diff_in_minutes = (time) => {
    const dateTime = new Date(time);
    const epochTime = dateTime.getTime();
    const epochTimeInSeconds = Math.floor(epochTime / 1000);

    const currentDateTime = new Date();
    const currentEpochTimeInSeconds = Math.floor(
      currentDateTime.getTime() / 1000
    );
    const diffInEpochTimeSeconds =
      currentEpochTimeInSeconds - epochTimeInSeconds;

    const diffInEpochTimeMinutes = (diffInEpochTimeSeconds / 60).toFixed(2);
    return diffInEpochTimeMinutes;
  };

  const tblColumn = () => {
    const column = [];

    for (const i in response[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
        i !== 'meter_protocol_type' &&
        i !== 'grid_id' &&
        i !== 'meter_address'
      ) {
        // const get_length = handle_row_element_length(i)

        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(1)}`.replace(
          '_',
          ' '
        );
        col_config.serch = i;
        col_config.sortable = true;
        // col_config.selector = i
        col_config.selector = (row) => row[i];
        // col_config.minWidth = get_length ? '200px' : '125px'
        // col_config.maxWidth = get_length ? '200px' : '125px'
        // col_config.maxWidth = i === 'feeder' ? '100px' : ''
        //  / col_config.style = {
        //     minHeight: '40px',
        //     maxHeight: '40px'
        //   }

        if ((i === 'LDP') | (i === 'consumer_name') | (i === 'consumer_id')) {
          col_config.width = '170px';
        }

        // if(i=="wallet_blance")
        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span
                className="d-block font-weight-bold cursor-pointer"
                onClick={() => handleRowClick(row, 'pss')}
                title={
                  row[i]
                    ? row[i] !== ''
                      ? row[i].toString().length > 18
                        ? row[i]
                        : ''
                      : '-'
                    : '-'
                }
              >
                {row[i] && row[i] !== ''
                  ? row[i].toString().substring(0, 18)
                  : '-'}
                {row[i] && row[i] !== ''
                  ? row[i].toString().length > 18
                    ? '...'
                    : ''
                  : '-'}
              </span>
            </div>
          );
        };
        column.push(col_config);
      }
    }

    if (props.hierarchy === 'user') {
      // Alert Light for Meter LDP
      column.push({
        name: 'Live Status',
        width: '120px',
        cell: (row) => {
          if (row.LDP === 'Na') {
            return (
              <>
                <Badge color="secondary" className="mx_7" id="success">
                  {/* {row.LDP} */}{' '}
                </Badge>
              </>
            );
          } else if (row.LDP !== 'Na') {
            const result = diff_in_minutes(row.LDP);

            if (result >= 0 && result < 20) {
              return (
                <>
                  <Badge color="success" className="mx_7" id="processing">
                    {/* {row.LDP} */}{' '}
                  </Badge>
                </>
              );
            } else if (result >= 20 && result < 40) {
              return (
                <>
                  <Badge color="warning" className="mx_7" id="processing">
                    {/* {row.LDP} */}{' '}
                  </Badge>
                </>
              );
            } else if (result >= 40) {
              return (
                <>
                  <Badge color="danger" className="mx_7" id="processing">
                    {/* {row.LDP} */}{' '}
                  </Badge>
                </>
              );
            }
          }
        },
      });
    }

    column.unshift({
      name: 'Sr',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex  justify-content-center">
            {i + 1 + 10 * (currentPage - 1)}
          </div>
        );
      },
    });

    return column;
  };

  const retryAgain = () => {
    refetch();
  };

  return !isFetching && !isError ? (
    <div className="table-wrapper">
      <DataTableV1
        columns={tblColumn()}
        data={response}
        rowCount={10}
        currentPage={currentPage}
        ispagination
        onPageChange={onPageChange}
        pointerOnHover={true}
        totalRowsCount={response.length}
        onRowClicked={handleRowClick}
        tableName={props.tableName}
      />
    </div>
  ) : (
    <div className="h-100 w-100">
      {isError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { isFetching },
          }}
        />
      ) : (
        <>{isFetching && <Loader hight="min-height-475" />}</>
      )}
    </div>
  );
};

export default EnergyConsumptionWrapper;
