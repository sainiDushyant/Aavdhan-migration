import { CardBody, Card, Badge, UncontrolledTooltip } from 'reactstrap';
import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import CommonMeterDropdown from '../commonMeterDropdown';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import Loader from '../../../../../../components/loader/loader';

import { caseInsensitiveSort } from '../../../../../../utils';

import { Download } from 'react-feather';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

import { toast } from 'react-toastify';
import {
  useDownloadMeterConfigurationRequestReportQuery,
  useLazyDownloadMeterConfigurationReportQuery,
} from '../../../../../../api/meter-configurationSlice';

const MeterConfigurationDownloadWrapper = (props) => {
  // Logout User
  // const [logout, setLogout] = useState(false)
  // useEffect(() => {
  //   if (logout) {
  //     authLogout(history, dispatch)
  //   }
  // }, [logout])

  const location = useLocation();
  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(120);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState([]);
  const [requestReport, reportData] =
    useLazyDownloadMeterConfigurationReportQuery();

  // const fetchData = async params => {
  //   return await useJwt
  //     .getMeterConfigurationDLMSDownloadRequestHistory(params)
  //     .then(res => {
  //       const status = res.status

  //       return [status, res]
  //     })
  //     .catch(err => {
  //       if (err.response) {
  //         const status = err.response.status
  //         return [status, err]
  //       } else {
  //         return [0, err]
  //       }
  //     })
  // }

  // const requestReport = async params => {
  //   return await useJwt
  //     .postMeterConfigurationDLMSDownloadRequest(params)
  //     .then(res => {
  //       const status = res.status

  //       return [status, res]
  //     })
  //     .catch(err => {
  //       if (err.response) {
  //         const status = err.response.status
  //         return [status, err]
  //       } else {
  //         return [0, err]
  //       }
  //     })
  // }

  const params = {};
  params['page'] = currentPage;
  params['page_size'] = pageSize;
  params['project'] = project;
  // params['report_name'] = props.report_name

  const {
    data: requestReportResponse,
    isFetching,
    isError,
    refetch,
  } = useDownloadMeterConfigurationRequestReportQuery(params);

  useEffect(() => {
    let statusCode = requestReportResponse?.responseCode;

    if (statusCode === 200) {
      setTotalCount(requestReportResponse?.data.result.count);
      setResponse(requestReportResponse?.data.result.results);
    } else if (statusCode === 401 || statusCode === 403) {
      // setLogout(true);
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [requestReportResponse]);

  const tblColumn = () => {
    const column = [];

    if (response) {
      for (const i in response[0]) {
        const col_config = {};

        if (i !== 'project' && i !== 'csv_url') {
          col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
            1
          )}`.replaceAll('_', ' ');
          col_config.serch = i;
          col_config.sortable = true;
          col_config.selector = (row) => row[i];
          col_config.sortFunction = (rowA, rowB) =>
            caseInsensitiveSort(rowA, rowB, i);
          // col_config.style = {
          //   width: '400px'
          // }
          col_config.width = '200px';

          col_config.cell = (row) => {
            return (
              <div className="d-flex">
                <span
                  className="d-block font-weight-bold  cursor-pointer"
                  title={row[i]}
                  onClick={() => {
                    // setData(row)
                    // setCenteredModal(true)
                  }}
                >
                  {row[i] && row[i] !== ''
                    ? row[i].toString().substring(0, 25)
                    : '-'}
                  {row[i] && row[i] !== ''
                    ? row[i].toString().length > 25
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

      column.push({
        name: 'Status',
        width: '120px',
        cell: (row) => {
          if (row.execution_status === 'Success') {
            return (
              <>
                <Badge pill color="light-success" className="">
                  {row.execution_status}
                </Badge>
              </>
            );
          } else if (row.execution_status === 'In_Progress') {
            return (
              <>
                <Badge pill color="light-warning" className="">
                  {row.execution_status}
                </Badge>
              </>
            );
          } else if (row.execution_status === 'Failed') {
            return (
              <>
                <Badge pill color="light-danger" className="">
                  {row.execution_status}
                </Badge>
              </>
            );
          }
        },
      });
      column.push({
        name: 'Download ',
        width: '120px',
        cell: (row) => {
          if (row.execution_status === 'Success') {
            return (
              <>
                <a href={row.csv_url}>
                  {/* <Badge pill color='light-success' className='' id='success'>
                    {row.status}
                  </Badge> */}
                  <Download size={20} className=" primary mx-2 " id="success" />
                </a>
                <UncontrolledTooltip
                  placement="top"
                  target="success"
                  modifiers={{
                    preventOverflow: { boundariesElement: 'window' },
                  }}
                  autohide={false}
                  delay={{ show: 200, hide: 5 }}
                >
                  File is ready to Download
                </UncontrolledTooltip>
              </>
            );
          } else if (row.execution_status === 'In_Progress') {
            return (
              <>
                <Download
                  size={20}
                  className="mx-2 text-secondary not_allowed "
                  id="processing"
                />
                <UncontrolledTooltip
                  placement="top"
                  target="processing"
                  modifiers={{
                    preventOverflow: { boundariesElement: 'window' },
                  }}
                  autohide={false}
                  delay={{ show: 200, hide: 5 }}
                >
                  In {row.execution_status} Can't Download
                </UncontrolledTooltip>
              </>
            );
          } else if (row.execution_status === 'Failed') {
            return (
              <>
                <Download
                  size={20}
                  className="mx-2 text-secondary not_allowed "
                  id="failed"
                />
                <UncontrolledTooltip
                  placement="top"
                  target="failed"
                  modifiers={{
                    preventOverflow: { boundariesElement: 'window' },
                  }}
                  autohide={false}
                  delay={{ show: 200, hide: 5 }}
                >
                  {row.execution_status} Can't Download
                </UncontrolledTooltip>
              </>
            );
          }
        },
      });
    }

    return column;
  };

  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };
  const reloadData = () => {
    setCurrentPage(1);
    refetch();
  };

  const onSubmitButtonClicked = async (filterParams) => {
    const params = {};
    params['project'] = project;
    // params['report_name'] = props.report_name

    if (
      filterParams.hasOwnProperty('site') &&
      filterParams['site'] &&
      filterParams['site'] !== ''
    ) {
      params['site'] = filterParams['site'];
    } else {
      params['site'] = '';
    }

    if (
      filterParams.hasOwnProperty('meter') &&
      filterParams['meter'] &&
      filterParams['meter'] !== ''
    ) {
      params['meter'] = filterParams['meter'];
    } else {
      params['meter'] = '';
    }

    if (
      filterParams.hasOwnProperty('start_date') &&
      filterParams['start_date'] &&
      filterParams['start_date'] !== ''
    ) {
      params['start_date'] = filterParams['start_date'];
    } else {
      params['start_date'] = '';
    }

    if (
      filterParams.hasOwnProperty('end_date') &&
      filterParams['end_date'] &&
      filterParams['end_date'] !== ''
    ) {
      params['end_date'] = filterParams['end_date'];
    } else {
      params['end_date'] = '';
    }

    requestReport(params);
  };

  useEffect(() => {
    if (reportData.status === 'fulfilled') {
      let statusCode = reportData?.currentData?.responseCode;
      if (statusCode === 200) {
        toast('Request submitted successfully ....', {
          hideProgressBar: true,
          type: 'success',
        });
        reloadData();
      } else if (statusCode === 401 || statusCode === 403) {
        // setLogout(true);
      } else {
        toast('Something went wrong please retry .....', {
          hideProgressBar: true,
          type: 'warning',
        });
      }
    }
  }, [reportData]);

  const retryAgain = () => {
    refetch();
  };

  return (
    <>
      <Card>
        <CardBody>
          <CommonMeterDropdown
            tab="block_load"
            set_resp={setResponse}
            onSubmitButtonClicked={onSubmitButtonClicked}
            hideDateRangeSelector={true}
            hideMeterSelector={false}
            hideMeterSearch={false}
          />
        </CardBody>

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
            <DataTableV1
              columns={tblColumn()}
              data={response}
              rowCount={10}
              tableName={'Meter Configuration Data Download Request'}
              showDownloadButton={true}
              showRefreshButton={true}
              refreshFn={refetch}
              showAddButton={false}
              currentPage={currentPage}
              totalRowsCount={totalCount}
              onPageChange={onNextPageClicked}
              isLoading={isFetching}
              pointerOnHover={true}
            />
          )
        )}
      </Card>
    </>
  );
};

export default MeterConfigurationDownloadWrapper;
