import React, { useEffect, useState } from 'react';
import { Col, Row, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Eye } from 'react-feather';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { useLocation } from 'react-router-dom';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import Loader from '../../../../../../components/loader/loader';
import { caseInsensitiveSort } from '../../../../../../utils';
import moment from 'moment';
import {
  useGetMdasDlmsCommandHistoryQuery,
  useLazyGetMdasDlmsHistoryDataQuery,
} from '../../../../../../api/hes/command-historySlice';
import SimpleTableForDLMSCommandResponse from '../../../../../../components/dtTable/simpleTableForDLMSCommandResponse';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const CommandInfoTableWrapper = (props) => {
  const [getDlmsHistoryData, dlmsHistoryDataResponse] =
    useLazyGetMdasDlmsHistoryDataQuery();

  const [errorMessage, setErrorMessage] = useState('');

  const [commandSelectedToViewResponse, setCommandSelectedToViewResponse] =
    useState('');

  const location = useLocation();
  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const [reloadCommandHistory, setReloadCommandHistory] = useState(true);
  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  let user_name = '';
  let meter_serial = '';
  if (HierarchyProgress && HierarchyProgress.user_name) {
    user_name = HierarchyProgress.user_name;
    meter_serial = HierarchyProgress.meter_serial_number;
  }

  const [histyData, setHistyData] = useState();
  const [centeredModal, setCenteredModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // TotalCount,response Local State
  const [response, setResponse] = useState([]);
  const [totalCount, setTotalCount] = useState(120);
  const [pageSize, setPageSize] = useState(10);

  const [protocol, setProtocol] = useState('dlms');

  if (
    HierarchyProgress &&
    HierarchyProgress.meter_protocol_type &&
    protocol === ''
  ) {
    setProtocol(HierarchyProgress.meter_protocol_type);
  }
  let params = {};

  if (protocol === 'tap') {
    params = {
      project: projectName,
      meter: HierarchyProgress.meter_address,
      page: currentPage,
      asset_type: 'meter',
      page_size: pageSize,
    };
  } else {
    params = {
      project: projectName,
      meter: HierarchyProgress.meter_serial_number,
      page: currentPage,
      asset_type: 'meter',
      page_size: pageSize,
    };
  }
  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  const {
    data: dlmsCommandHistoryResponse,
    isFetching: dlmsCommandHistoryLoading,
    isError: dlmsCommandHistoryError,
    refetch: fetchCommandHistory,
  } = useGetMdasDlmsCommandHistoryQuery(params);

  const loading = dlmsCommandHistoryLoading;

  useEffect(() => {
    if (dlmsCommandHistoryResponse) {
      let statusCode = dlmsCommandHistoryResponse?.responseCode;
      if (statusCode === 200 || statusCode === 204) {
        setResponse(dlmsCommandHistoryResponse.data.result.results);
        setTotalCount(dlmsCommandHistoryResponse.data.result.count);
      } else {
        setErrorMessage('Network Error, please retry');
      }
    }
  }, [dlmsCommandHistoryResponse]);

  const tblColumn = () => {
    const column = [];
    const custom_width = [
      'command',
      'params',
      'update_time',
      'start_time',
      'timestamp',
      'execution_time',
      'user',
    ];

    for (const i in response[0]) {
      const col_config = {};
      if (i !== 'id' && i !== 'meter' && i !== 'meter_serial') {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.sortable = true;
        col_config.reorder = true;
        col_config.selector = (row) => row[i];
        col_config.sortFunction = (rowA, rowB) =>
          caseInsensitiveSort(rowA, rowB, i);

        if (custom_width.includes(i)) {
          col_config.width = '190px';
        }

        col_config.cell = (row) => {
          return (
            <div className="d-flex">
              <span
                className="d-block font-weight-bold"
                title={
                  row[i]
                    ? row[i]
                      ? row[i] !== ''
                        ? row[i].toString().length > 23
                          ? row[i]
                          : ''
                        : '-'
                      : '-'
                    : '-'
                }
              >
                {row[i]
                  ? row[i] && row[i] !== ''
                    ? row[i].toString().substring(0, 23)
                    : '-'
                  : '-'}
                {row[i]
                  ? row[i] && row[i] !== ''
                    ? row[i].toString().length > 23
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
    const showData = async (row) => {
      const params = {
        'command-execution': row.id,
      };
      let response = await getDlmsHistoryData(params);
      setCenteredModal(true);
      let statusCode = response?.data?.responseCode;
      if (statusCode === 200 || statusCode === 202) {
        let data = response?.data?.data?.result?.data;
        if (Array.isArray(data)) {
          const filteredData = data.filter(
            (obj) => !obj.hasOwnProperty('MD_W_TOD_1')
          );

          // let data = response.data.data.result.data
          if (Array.isArray(filteredData)) {
            data = filteredData.map((item) => {
              for (const key in item) {
                if (item[key] === '65535-00-00 00:00:00') {
                  item[key] = '--';
                }
                // if (key.includes("import_Wh") || key.includes("import_VAh")) {
                //   item[key] = item[key].toFixed(2)
                // }
              }

              return item;
            });
          }
        }

        const cmdDetail = `${row.meter_number}_${row.command}_${row.start_time}`;
        const newData = {
          data,
          cmd_detail: cmdDetail,
        };

        setCommandSelectedToViewResponse(row.command);
        setHistyData(newData);

        setCenteredModal(true);
      } else {
        toast('No data Available .', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    };

    // const showTapData = async (row) => {
    //   const params = {
    //     id: row.id,
    //     project: projectName,
    //   };
    //   const [statusCode, response] = await fetchHistoryDataDetail(params);
    //   if (statusCode === 401 || statusCode === 403) {
    //     setLogout(true);
    //   } else if (statusCode === 200) {
    //     const data = response.data.data.result;

    //     data['cmd_detail'] = {
    //       meter_serial: row.meter_number,
    //       command: row.command,
    //       execution: row.execution_time,
    //     };

    //     setTapHistyData(data);

    //     setTapViewModal(true);
    //   } else {
    //     toast.error(<Toast msg="No data Available ." type="danger" />, {
    //       hideProgressBar: true,
    //     });
    //   }
    // };

    column.push({
      name: 'Response Time',
      cell: (row) => {
        const timeDifferenceInSeconds = moment(row.update_time).diff(
          row.start_time,
          'seconds'
        );
        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
        const seconds = timeDifferenceInSeconds % 60;

        return `${
          hours ? hours.toString().concat(hours === 1 ? ' hr' : ' hrs') : ''
        } ${minutes ? minutes.toString().concat(' min') : ''} ${seconds
          .toString()
          .concat(' sec')}`;
      },
    });

    if (protocol === 'dlms') {
      column.push({
        name: 'View',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <Eye
              size="20"
              className="ml_6 cursor-pointer text-primary "
              onClick={() => showData(row)}
            />
          );
        },
      });
    }

    // if (protocol === 'tap') {
    //   column.push({
    //     name: 'View',
    //     maxWidth: '100px',

    //     cell: (row) => {
    //       return (
    //         <Eye
    //           size="20"
    //           className="ml_6 cursor-pointer text-primary "
    //           onClick={() => showTapData(row)}
    //         />
    //       );
    //     },
    //   });
    // }

    column.unshift({
      name: 'Sr No.',
      width: '90px',
      sortable: false,
      cell: (row, i) => {
        return (
          <div className="d-flex justify-content-center">
            {i + 1 + pageSize * (currentPage - 1)}
          </div>
        );
      },
    });

    return column;
  };

  const isArray = (a) => {
    return !!a && a.constructor === Array;
  };

  const historyData = (historyData) => {
    const data = historyData.data.data
      ? historyData.data.data
      : historyData.data;
    const tableData = {};

    try {
      for (const i of data) {
        if (i['data_type'] in tableData) {
          tableData[i['data_type']].push(i);
        } else {
          tableData[i['data_type']] = [i];
        }
      }
    } catch (err) {}

    return data ? (
      !isArray(data) ? (
        <Col sm="12">
          {Object.keys(data).length !== 0 ? (
            Object.keys(data).map((info, index) => (
              <Row key={index}>
                <Col sm="4" className="text-right border py-1">
                  {`${info.charAt(0).toUpperCase()}${info.slice(1)}`.replaceAll(
                    '_',
                    ' '
                  )}
                </Col>
                <Col sm="8" className="border py-1">
                  <h5 className="m-0">{data[info]}</h5>
                </Col>
              </Row>
            ))
          ) : (
            <h3 className="text-center">No data found</h3>
          )}
        </Col>
      ) : (
        <Col sm="12" className="mb-3">
          {data.length > 0 ? (
            Object.keys(tableData).map((info, index) => (
              <SimpleTableForDLMSCommandResponse
                key={index}
                data={tableData[info]}
                smHeading={true}
                height="max"
                tableName={`${historyData.cmd_detail}`}
                rowCount={10}
                commandName={commandSelectedToViewResponse}
              />
            ))
          ) : (
            <h3 className="text-center">No data found</h3>
          )}
        </Col>
      )
    ) : (
      ''
    );
  };

  const fullInfo = () => {
    return <Row>{histyData ? historyData(histyData) : ''}</Row>;
  };

  const onNextPageClicked = (page) => {
    setCurrentPage(page + 1);
  };

  const protocolSelected = (value) => {
    setProtocol(value);
    setReloadCommandHistory(true);
    setCurrentPage(1);
    setResponse([]);
    setTotalCount(0);
  };

  const retryAgain = () => {
    fetchCommandHistory();
  };

  // const tapViewDetail = () => {
  //   return (
  //     <div style={{ fontSize: '12px' }}>
  //       Meter serial : <b>{tapHistyData.cmd_detail.meter_serial}</b>
  //       <br></br>
  //       Command : <b>{tapHistyData.cmd_detail.command}</b>
  //       <br></br>
  //       Exetution time : <b>{tapHistyData.cmd_detail.execution}</b>
  //       <br></br>
  //       <br></br>
  //       Command response: <b>{tapHistyData.data}</b>
  //     </div>
  //   );
  // };

  return (
    <div>
      {dlmsCommandHistoryError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { loading },
          }}
        />
      ) : (
        <>
          {!loading && (
            <div className="table-wrapper">
              <DataTableV1
                columns={tblColumn()}
                data={response}
                rowCount={pageSize}
                setRowCount={setRowCount}
                tableName={`Command History Table ${meter_serial}`}
                refreshFn={fetchCommandHistory}
                status={loading}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                protocolSelected={protocolSelected}
                protocol={protocol}
                showRefreshButton={true}
              />
            </div>
          )}
          {loading && <Loader hight="min-height-475" />}
        </>
      )}
      {/* Command History data modal */}
      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          Command History data
        </ModalHeader>
        <ModalBody>{fullInfo()}</ModalBody>
      </Modal>

      {/* Command History data modal */}
      {/* <Modal
        isOpen={tapViewModal}
        toggle={() => setTapViewModal(!tapViewModal)}
        className={`modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setTapViewModal(!tapViewModal)}>
          Tap command response detail
        </ModalHeader>
        <ModalBody>{tapHistyData && tapViewDetail()}</ModalBody>
      </Modal> */}
    </div>
  );
};

export default CommandInfoTableWrapper;
