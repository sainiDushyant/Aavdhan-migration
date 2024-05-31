import { CardBody, Card, Modal, ModalHeader, ModalBody } from 'reactstrap';
import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import CommonMeterDropdown from '../commonMeterDropdown';

import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import Loader from '../../../../../../components/loader/loader';

import PushDataDownloadWrapper from './PushDataDownloadWrapper';

import { X } from 'react-feather';

import moment from 'moment';
import { useGetBlockLoadDataQuery } from '../../../../../../api/hes/push-dataSlice';

const BlockLoadData = (props) => {
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD 00:00:00'); // Yesterday, start of day
  const defaultEndDate = moment().format('YYYY-MM-DD HH:00:00');

  // const defaultEndDate = '2024-05-16 00:00:00';

  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(120);
  const [pageSize, setPageSize] = useState(10);
  const [response, setResponse] = useState([]);
  const [filterParams, setFilterParams] = useState({
    start_date: defaultStartDate,
    end_date: defaultEndDate,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [showReportDownloadModal, setShowReportDownloadModal] = useState(false);

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }
  let params = {};
  params = { project, ...filterParams, page: currentPage, page_size: pageSize };

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };
  // if (!filterParams.hasOwnProperty('site')) {
  // If No Site Selected, add all sites access available
  // let dtr_list = ' '
  // for (let i = 0; i < responseData.responseData.dtr_list.length; i++) {
  //   dtr_list += `${responseData.responseData.dtr_list[i]['dtr_id']},`
  // }
  const { data, isFetching, isError, refetch } =
    useGetBlockLoadDataQuery(params);

  useEffect(() => {
    let statusCode = data?.responseCode;
    if (statusCode === 200) {
      const blockLoadResponse = data.data.result.results.map((e) => {
        const temp_blockload = { ...e.data };
        if (temp_blockload.meter_number === 'not') {
          temp_blockload.meter_number = '--';
        }

        if (temp_blockload.hasOwnProperty('avg_voltage')) {
          temp_blockload['avg_voltage'] = Number(
            temp_blockload['avg_voltage']
          ).toFixed(2);
        }

        if (temp_blockload.hasOwnProperty('avg_current')) {
          temp_blockload['avg_current'] = Number(
            temp_blockload['avg_current']
          ).toFixed(2);
        }

        if (temp_blockload.hasOwnProperty('temperature')) {
          return temp_blockload;
        }
        return temp_blockload;
      });
      console.log(blockLoadResponse, 'blockLoadResponse');
      setResponse(blockLoadResponse);
      setTotalCount(data?.data.result.count);
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [data]);

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

  const retryAgain = () => {
    refetch();
  };

  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };

  const onSubmitButtonClicked = (filterParams) => {
    setFilterParams(filterParams);
    setCurrentPage(1);
  };

  const handleReportDownloadModal = () => {
    setShowReportDownloadModal(!showReportDownloadModal);
  };

  const reFresh = () => {
    setFilterParams({});
    setCurrentPage(1);
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
                tableName={'Block Load Table'}
                showDownloadButton={true}
                showRefreshButton={true}
                refreshFn={reFresh}
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
          <h4 className="modal-title">Download (Blockload Data)</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <PushDataDownloadWrapper
            report_name={'block_load'}
            table_name={'Blockload Data Table'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default BlockLoadData;
