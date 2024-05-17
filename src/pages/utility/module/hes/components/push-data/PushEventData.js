import { useState, useEffect } from 'react';

import { useFetcher, useLocation } from 'react-router-dom';
import moment from 'moment-timezone';
import { CardBody, Card, Modal, ModalHeader, ModalBody } from 'reactstrap';

import CommonMeterDropdown from './commonMeterDropdown';

import Loader from '../../../../../../components/loader/loader';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import { caseInsensitiveSort } from '../../../../../../utils';

import PushDataDownloadWrapper from './PushDataDownloadWrapper';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';
import { X } from 'react-feather';
import { useGetPushBasedEventQuery } from '../../../../../../api/push-dataSlice';

const PushEventData = () => {
  const location = useLocation();
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD 00:00:00'); // Yesterday, start of day
  // const defaultEndDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const defaultEndDate = '2024-05-17 00:00:00';

  // Logout User
  // const [logout, setLogout] = useState(false);
  // useEffect(() => {
  //   if (logout) {
  //     authLogout(history, dispatch);
  //   }
  // }, [logout]);

  // const responseData = useSelector(state => state.UtilityMdmsFlowReducer)

  const [fetchingData, setFetchingData] = useState(true);
  const [response, setResponse] = useState([]);
  const [totalCount, setTotalCount] = useState(120);
  const [dtr, setDtr] = useState('');
  const [filterParams, setFilterParams] = useState({
    start_date: defaultStartDate,
    end_date: defaultEndDate,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retry, setRetry] = useState(false);

  const [loader, setLoader] = useState(false);

  const [showReportDownloadModal, setShowReportDownloadModal] = useState(false);

  // const fetchData = async (params) => {
  //   return await useJwt
  //     .getPushBasedEvent(params)
  //     .then((res) => {
  //       const status = res.status;
  //       return [status, res];
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         const status = err.response.status;
  //         return [status, err];
  //       } else {
  //         return [0, err];
  //       }
  //     });
  // };

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  useEffect(() => {
    if (dtr.length > 1) {
      setFilterParams({ ...filterParams, site: dtr });
    }
  }, [dtr]);

  let params = undefined;

  params = {
    project,
    ...filterParams,
    page: currentPage,
    page_size: 10,
  };

  const { data, isFetching, isError, refetch } =
    useGetPushBasedEventQuery(params);

  useEffect(() => {
    let statusCode = data?.responseCode;
    if (statusCode === 200) {
      const response_temp = [];
      for (let i = 0; i < data?.data?.result?.results?.length; i++) {
        const event_message = data?.data?.result?.results[i]['event_message'];
        const meter_time = data?.data?.result?.results[i]['meter_time'];
        const meter_number = data?.data?.result?.results[i]['meter_number'];
        const reporting_timestamp =
          data?.data?.result?.results[i]['reporting_timestamp'];

        for (let j = 0; j < event_message.length; j++) {
          const temp = {};

          temp['meter_number'] = meter_number;
          temp['index_value'] = event_message[j]['index'];
          temp['event_message'] = event_message[j]['message'];
          temp['timestamp'] = meter_time;
          temp['reporting_timestamp'] = reporting_timestamp;

          response_temp.push(temp);
        }
        setResponse(response_temp);
        setTotalCount(data?.data.result.count);
      }
    } else if (statusCode === 401 || statusCode === 403) {
      // setLogout(true);
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [data]);

  const tblColumn = () => {
    const column = [];

    for (const i in response[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
        i !== 'push_obis' &&
        i !== 'push_counter' &&
        i !== 'avon_obis_1' &&
        i !== 'avon_obis_2' &&
        i !== 'avon_obis_3' &&
        i !== 'avon_obis_4' &&
        i !== 'reporting_timestamp'
      ) {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        // col_config.selector = i
        // col_config.minWidth = get_length ? '200px' : '125px'
        // col_config.maxWidth = get_length ? '200px' : '125px'
        // col_config.maxWidth = i === 'feeder' ? '100px' : ''
        // col_config.style = {
        //   minHeight: '40px',
        //   maxHeight: '40px'
        // }
        // col_config.width = '90px'

        if (i === 'index_value') {
          col_config.maxWidth = '250px';
        } else if (i === 'meter_number') {
          col_config.width = '150px';
        }

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span className="d-block font-weight-bold ">
                {row[i]}
                {/* title={row[i] ? (row[i] !== '' ? (row[i].toString().length > 10 ? row[i] : '') : '-') : '-'}>
                {row[i] && row[i] !== '' ? row[i].toString().substring(0, 10) : '-'}
                {row[i] && row[i] !== '' ? (row[i].toString().length > 10 ? '...' : '') : '-'} */}
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
      sortable: false,
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {i + 1 + 10 * (currentPage - 1)}
          </div>
        );
      },
    });
    // console.log();
    // column.push({
    //   name: "Response Time",
    //   width: "140px",
    //   position: 5,
    //   cell: (row) => {
    //     if (row.reporting_timestamp && row.timestamp) {
    //       const timeDifferenceInSeconds = moment(row.reporting_timestamp).diff(
    //         row.timestamp,
    //         "seconds"
    //       )
    //       const hours = Math.floor(timeDifferenceInSeconds / 3600)
    //       const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60)
    //       const seconds = timeDifferenceInSeconds % 60
    //       return (
    //         <>
    //           {hours ? `${hours} ${hours === 1 ? "hr" : "hrs"}` : ""}{" "}
    //           {minutes ? `${minutes} min` : ""} {`${seconds} sec`}
    //         </>
    //       )
    //     } else {
    //       return <>N/A</>
    //     }
    //   }
    // })
    return column;
  };

  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };

  const reloadData = () => {
    setCurrentPage(1);
    refetch();
  };

  const onSubmitButtonClicked = (filterParams) => {
    // console.log('Value passed from child to parent ....')
    // console.log(dummy)
    setFilterParams(filterParams);
    setCurrentPage(1);
    setFetchingData(true);
    setError(false);
    setRetry(true);
  };
  const retryAgain = () => {
    refetch();
  };

  const handleReportDownloadModal = () => {
    setShowReportDownloadModal(!showReportDownloadModal);
  };

  // custom Close Button for Report Download Modal
  const CloseBtnForReportDownload = (
    <X
      className="cursor-pointer mt_5"
      size={15}
      onClick={handleReportDownloadModal}
    />
  );

  return (
    <>
      <Card>
        <CardBody>
          <CommonMeterDropdown
            tab="block_load"
            set_resp={setResponse}
            onSubmitButtonClicked={onSubmitButtonClicked}
            set_dtr={setDtr}
            defaultSelectedDTR={true}
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
            <div className="table-wrapper">
              <DataTableV1
                columns={tblColumn()}
                data={response}
                rowCount={10}
                tableName={'Push Event Data'}
                showDownloadButton={true}
                showRefreshButton={true}
                refreshFn={reloadData}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                isLoading={isFetching}
                pointerOnHover={true}
                extraTextToShow={
                  <div
                    className={`${
                      totalCount ? 'text-success' : 'text-danger'
                    } m-0`}
                  >
                    Total Push Event Count: {totalCount}
                  </div>
                }
                handleReportDownloadModal={handleReportDownloadModal}
                isDownloadModal={'yes'}
              />
            </div>
          )
        )}
      </Card>

      {/* Report Download Request History Modal */}
      <Modal
        isOpen={showReportDownloadModal}
        toggle={handleReportDownloadModal}
        style={{ width: '82%' }}
        modalClassName="modal-slide-in"
        contentClassName="pt-0"
      >
        <ModalHeader
          className="d-flex justify-content-between"
          toggle={handleReportDownloadModal}
          close={CloseBtnForReportDownload}
          tag="div"
        >
          <h4 className="modal-title">Download (Push Event Data)</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <PushDataDownloadWrapper
            report_name={'event_push'}
            table_name={'Push Event Data Table'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default PushEventData;
