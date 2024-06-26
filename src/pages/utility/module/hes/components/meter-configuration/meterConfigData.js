//import CreateTable from '../../../../../../components/dtTable/createTable';

import {
  CardBody,
  Card,
  Modal,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import Loader from '../../../../../../components/loader/loader';
import { useGetMeterConfigurationListQuery } from '../../../../../../api/hes/meter-configurationSlice';
import { Edit, X } from 'react-feather';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';
import CommonMeterDropdown from '../commonMeterDropdown';
import MeterConfigurationDownloadWrapper from './meterConfigurationDownloadWrapper';
import MeterConfigDataModal from './meterConfigDataModal';

const MeterConfigData = (props) => {
  const location = useLocation();
  const currentSelectedModule = useSelector(
    (state) => state.currentSelectedModule
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(120);
  const [pageSize, setPageSize] = useState(10);

  const [response, setResponse] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  const [errorMessage, setErrorMessage] = useState('');

  const [editCommunicationProtocolModal, setEditCommunicationProtocolModal] =
    useState(false);

  const [showReportDownloadModal, setShowReportDownloadModal] = useState(false);

  const [rowData, setRowdata] = useState();

  const communicationProtocol = [
    { value: 'MQTT', label: 'MQTT' },
    { value: 'RF', label: 'RF' },
    { value: 'TCP', label: 'TCP' },
  ];

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }
  let params = {};
  params = {
    project,
    ...filterParams,
    page: currentPage,
    page_size: pageSize,
  };

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  // useEffect(async () => {
  // if (fetchingData || retry) {
  //   setLoader(true)
  // if (!filterParams.hasOwnProperty('site')) {
  // If No Site Selected, add all sites access available
  // let dtr_list = ' '
  // for (let i = 0; i < responseData.responseData.dtr_list.length; i++) {
  //   dtr_list += `${responseData.responseData.dtr_list[i]['dtr_id']},`
  // }

  // const [statusCode, response] = await fetchData(params)

  if (
    project !== currentSelectedModule &&
    filterParams.hasOwnProperty('site') &&
    filterParams.hasOwnProperty('meter')
  ) {
    params = {
      project,
      page: currentPage,
      page_size: pageSize,
    };
    props.setActive('1');
  }

  const { data, isError, isFetching, refetch } =
    useGetMeterConfigurationListQuery(params);
  useEffect(() => {
    let statusCode = data?.responseCode;
    if (statusCode === 200) {
      const meterConfigurationResponse = [];
      for (let i = 0; i < data?.data.result.results.length; i++) {
        const temp = { ...data?.data.result.results[i] };

        const other_config_temp = temp.other_config;
        delete temp.other_config;

        // Inserting new column Blockload Interval Min
        if (other_config_temp.hasOwnProperty('blockload_interval_min')) {
          temp['Blockload Interval'] = other_config_temp.blockload_interval_min;
        } else {
          temp['Blockload Interval'] = '-';
        }

        // Inserting new column Blockload Interval Min
        if (other_config_temp.hasOwnProperty('event_push_ipv6')) {
          temp['Push Event IPV6'] = other_config_temp.event_push_ipv6;
        } else {
          temp['Push Event IPV6'] = '-';
        }

        // Inserting new column Blockload Interval Min
        if (other_config_temp.hasOwnProperty('periodic_push_ipv6')) {
          temp['Periodic Push IPV6'] = other_config_temp.periodic_push_ipv6;
        } else {
          temp['Periodic Push IPV6'] = '-';
        }

        // Inserting new column Blockload Interval Min
        if (other_config_temp.hasOwnProperty('periodic_push_time')) {
          temp['Periodic Push Time'] = other_config_temp.periodic_push_time;
        } else {
          temp['Periodic Push Time'] = '-';
        }

        temp['is_enabled'] = temp.is_enabled.toString().toUpperCase();
        meterConfigurationResponse.push(temp);
      }

      setResponse(meterConfigurationResponse);
      setTotalCount(data?.data.result.count);
      setErrorMessage('Something went wrong, please retry');
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [data]);

  const onEditModal = () => {
    setEditCommunicationProtocolModal(!editCommunicationProtocolModal);
  };
  function createColumns() {
    const columns = [];
    const ignoreColumns = ['id', 'sc_no', 'parameter'];
    const disableSortings = [
      'site id',
      'Parameter',
      'Command',
      'Current status',
      'Created at',
    ];
    const customPositions = {
      meter_number: 1,
      command: 2,
      start_time: 3,
      execution_start_time: 4,
      update_time: 5,
      execution_status: 6,
    };
    if (response?.length > 0) {
      for (const i in response[0]) {
        const column = {};
        if (!ignoreColumns.includes(i)) {
          column.name = `${i.charAt(0).toUpperCase()}${i.slice(1)}`.replaceAll(
            '_',
            ' '
          );
          column.sortable = !disableSortings.includes(i);
          column.selector = (row) => row[i];
          column.reorder = true;
          column.position = customPositions[i] || 1000;
          column.minWidth = '190px';
          column.wrap = true;

          column.cell = (row) => {
            if (row[i] || [0, '0'].includes(row[i])) {
              if (Array.isArray(row[i])) {
                row[i] = row[i].join(' , ');
              }
              if (row[i].toString()?.length > 25) {
                return (
                  <span
                    onClick={(event) => {
                      if (event.target.textContent.toString()?.length <= 29) {
                        event.target.textContent = row[i];
                        event.target.style.overflowY = 'scroll';
                      } else {
                        event.target.textContent = `${row[i]
                          .toString()
                          .substring(0, 25)}...`;
                        event.target.style.overflowY = 'visible';
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      maxHeight: '200px',
                    }}
                    className="webi_scroller"
                    title={'click to expand text'}
                  >
                    {row[i].toString().substring(0, 25)}...
                  </span>
                );
              }
            } else {
              return '-';
            }
            return row[i];
          };
          columns.push(column);
        }
      }
      columns.push({
        name: 'Action',
        width: '70px',
        cell: (row) => {
          return (
            <>
              <Edit
                size="15"
                color="blue"
                className="ml-1 cursor-pointer"
                onClick={() => {
                  setRowdata(row);
                  onEditModal();
                }}
              />
            </>
          );
        },
      });
      const sortedColumns = columns.sort((a, b) => {
        if (a.position < b.position) {
          return -1;
        } else if (a.position > b.position) {
          return 1;
        }
        return 0;
      });
      sortedColumns.unshift({
        name: 'Sr No',
        width: '90px',
        cell: (row, i) => {
          return (
            <div className="d-flex w-100 justify-content-center">
              {i + 1 + pageSize * (currentPage - 1)}
            </div>
          );
        },
      });
      return sortedColumns;
    }
  }

  const onNextPageClicked = (page) => {
    setCurrentPage(page + 1);
  };
  // const reloadData = () => {
  //   setCurrentPage(1)
  //  // setFetchingData(true)
  //  isFetching()
  // }

  // if (currentSelectedModuleStatus.prev_project) {
  //   if (
  //     selected_project !== currentSelectedModuleStatus.project &&
  //     currentSelectedModuleStatus.prev_project !==
  //       currentSelectedModuleStatus.project
  //   ) {
  //     set_selected_project(currentSelectedModuleStatus.project);
  //     setFilterParams({});
  //     //setError(false)
  //     //reloadData()
  //     refetch();
  //   }
  // }

  const onSubmitButtonClicked = (filterParams) => {
    setFilterParams(filterParams);
    setCurrentPage(1);
    //setFetchingData(true)
    //isFetching();
  };

  const retryAgain = () => {
    // setError(false)
    // setRetry(true)
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
            <div className="table-wrapper">
              <DataTableV1
                columns={createColumns()}
                data={response}
                rowCount={pageSize}
                setRowCount={setRowCount}
                tableName={'Meter Configuration Table'}
                showDownloadButton={true}
                showRefreshButton={true}
                refreshFn={refetch}
                showAddButton={false}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                isLoading={isFetching}
                pointerOnHover={true}
                extraTextToShow={
                  <div
                    className={`${
                      totalCount ? 'text-success' : 'text-danger'
                    } m-0 w-100`}
                  >
                    Total Block Load Count: {totalCount}
                  </div>
                }
                handleReportDownloadModal={handleReportDownloadModal}
                isDownloadModal={'yes'}
              />
            </div>
          )
        )}
      </Card>

      {/* To Edit communication Protocol Modal */}
      <Modal
        isOpen={editCommunicationProtocolModal}
        toggle={() => onEditModal()}
        className="modal-dialog-centered modal-md mb-0"
      >
        <ModalHeader toggle={() => onEditModal()}>
          {' '}
          Edit Communication Protocol{' '}
        </ModalHeader>

        <ModalBody>
          <MeterConfigDataModal
            onEditModal={onEditModal}
            row={rowData}
            // setFetchingData={setFetchingData}
            IsFetching={isFetching}
          />
        </ModalBody>
      </Modal>

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
          <h4 className="modal-title">Download (Meter Configuration Data)</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <MeterConfigurationDownloadWrapper />
        </ModalBody>
      </Modal>
    </>
  );
};

export default MeterConfigData;
