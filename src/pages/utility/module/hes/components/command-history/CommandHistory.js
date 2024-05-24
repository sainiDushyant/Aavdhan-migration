import React, { useEffect, useState, Fragment } from 'react';
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { Eye, X, Layers, Download } from 'react-feather';
import SimpleTableForDLMSCommandResponse from '../../../../../../components/dtTable/simpleTableForDLMSCommandResponse';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';

import Loader from '../../../../../../components/loader/loader';
import { caseInsensitiveSort } from '../../../../../../utils';

import CommandRetryConfig from './command-retry-config/commandRetryConfig';
import CommandHistoryDataDownloadWrapper from './commandHistoryDataDownloadWrapper';
import moment from 'moment-timezone';

import {
  useGetMdasDlmsCommandHistoryQuery,
  useGetMdasTapCommandHistoryQuery,
  useLazyGetMdasDlmsHistoryDataQuery,
} from '../../../../../../api/hes/command-historySlice';
import FilterForm from './filterForm';
import '../../../../../../assets/css/util.scss';
const CommandHistory = (props) => {
  // const [getTapCommandHistory, tapCommandHistoryResponse] =
  //   useLazyGetMdasTapCommandHistoryQuery();

  const [getDlmsHistoryData, dlmsHistoryDataResponse] =
    useLazyGetMdasDlmsHistoryDataQuery();
  const location = useLocation();
  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const verticalName = location.pathname.split('/')[1];
  const [histyData, setHistyData] = useState();
  const [tapHistyData, setTapHistyData] = useState(undefined);
  const [centeredModal, setCenteredModal] = useState(false);
  const [tapViewModal, setTapViewModal] = useState(false);
  const [centeredSchedulerModal, setCenteredSchedulerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [filterAppliedParams, setFilterAppliedParams] = useState(undefined);
  const [schedulerState, setSchedulerState] = useState(false);

  const [tableName, setTableName] = useState('Command History');
  const [tableNameUpdated, setTableNameUpdated] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('dtr');
  const [rowExecutionStatus, setRowExecutionStatus] = useState([]);

  // const [protocolSelectionOption, setProtocolSelectionOption] = useState(props.selectProtocol)

  const [selected_project, set_selected_project] = useState(undefined);

  const [commandRetryConfigModal, setCommandRetryConfigModal] = useState(false);

  const [showReportDownloadModal, setShowReportDownloadModal] = useState(false);

  const [commandSelectedToViewResponse, setCommandSelectedToViewResponse] =
    useState('');

  const [commandName, setCommandName] = useState('');

  const currentTime = moment().tz('Asia/Kolkata');

  const getParams = () => {
    let params = {};
    if (filterAppliedParams) {
      if ('site_id' in filterAppliedParams) {
        params = {
          page: currentPage,
          page_size: 10,
          project: projectName,
          ...filterAppliedParams, // Add Filter params
        };
      } else {
        const dtr_list = '';
        // for (let i = 0; i < responseData.responseData.dtr_list.length; i++) {
        //   dtr_list += `${responseData.responseData.dtr_list[i]['dtr_id']},`
        // }
        params = {
          page: currentPage,
          page_size: 10,
          project: projectName,
          site_id: dtr_list,
          ...filterAppliedParams, // Add Filter params
        };
      }
    } else {
      const dtr_list = '';
      // for (let i = 0; i < responseData.responseData.dtr_list.length; i++) {
      //   dtr_list += `${responseData.responseData.dtr_list[i]['dtr_id']},`
      // }
      params = {
        page: currentPage,
        page_size: 10,
        project: projectName,
        site_id: dtr_list,
        asset_type: 'dtr',
      };
    }
    if (props.protocol === 'dlms') {
      return params;
    } else if (props.protocol === 'tap') {
      // Add Command Name for TAP Protocol
      params['command'] =
        'turn_relay_on,turn_relay_off,relay_manual_control,relay_auto_control';

      return params;
    }
  };

  const {
    data: dlmsCommandHistoryResponse,
    isFetching: dlmsCommandHistoryLoading,
    isError: dlmsCommandHistoryError,
    refetch: fetchCommandHistory,
  } = useGetMdasDlmsCommandHistoryQuery(getParams());

  const loading = dlmsCommandHistoryLoading;
  const hasError = dlmsCommandHistoryError; // Logout User

  const handleReportDownloadModal = () => {
    setShowReportDownloadModal(!showReportDownloadModal);
  };

  if (props.tableName && !tableNameUpdated) {
    setTableName(props.tableName);
    setTableNameUpdated(true);
  }

  // TotalCount,response Local State
  const [response, setResponse] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const protocolSelected = (value) => {
    // setProtocol(value)
    props.protocolSelectedForCommandExecution(value);
    // setReloadCommandHistory(true)
    setCurrentPage(1);
    setResponse([]);
    setTotalCount(0);
    setFilterAppliedParams(undefined);
  };

  const AppliedFilterparams = (params, resetcalled) => {
    if (resetcalled) {
      setFilterAppliedParams(params);
      setCurrentPage(1);
      setResponse([]);
      setTotalCount(0);
      setCurrentPage(1);
      setResponse([]);
      setTotalCount(0);
    } else {
      if (params) {
        setFilterAppliedParams(params);
        setCurrentPage(1);
        setResponse([]);
        setTotalCount(0);
      }
    }
  };

  useEffect(() => {
    if (dlmsCommandHistoryResponse) {
      //   console.log(dlmsCommandHistoryResponse, 'hello');
      let statusCode = dlmsCommandHistoryResponse?.responseCode;
      if (statusCode === 200 || statusCode === 204) {
        dlmsCommandHistoryResponse?.data?.result?.results?.map((item) => {
          let newItem = { ...item };
          // Convert update_time string to a moment object
          const updateMoment = moment(
            newItem.update_time,
            'YYYY-MM-DD HH:mm:ss'
          ).tz('Asia/Kolkata');

          // console.log("Update Time:", updateMoment.format("YYYY-MM-DD HH:mm:ss"))
          // Check if update_time is greater than the current time
          // console.log(updateMoment.isAfter(currentTime))
          if (updateMoment.isAfter(currentTime)) {
            newItem.update_time = newItem.execution_start_time;
            newItem.execution_status = 'In Progress';
          }
          // if (
          //   item.command === 'LIVE_VERSION' ||
          //   item.command === 'BLOCK_LOAD' ||
          //   item.command === 'DAILY_LOAD' ||
          //   item.command === 'EVENTS'
          // ) {
          //   const randomIndex1 = Math.floor(
          //     Math.random() * diffTimeSec.length
          //   );
          //   const randomIndex2 = Math.floor(
          //     Math.random() * diffTimeSec.length
          //   );

          //   if (
          //     !item.execution_start_time &&
          //     item.execution_status === 'Success'
          //   ) {
          //     item.execution_start_time = moment(item.start_time)
          //       .add(1, 'second')
          //       .format('YYYY-MM-DD HH:mm:ss');
          //     item.update_time = moment(item.execution_start_time)
          //       .add(diffTimeSec[randomIndex2], 'second')
          //       .format('YYYY-MM-DD HH:mm:ss');
          //   } else if (
          //     item.execution_start_time === item.start_time &&
          //     item.start_time === item.update_time &&
          //     item.execution_status === 'Success'
          //   ) {
          //     item.execution_start_time = moment(item.start_time)
          //       .add(1, 'second')
          //       .format('YYYY-MM-DD HH:mm:ss');
          //     item.update_time = moment(item.execution_start_time)
          //       .add(diffTimeSec[randomIndex2], 'second')
          //       .format('YYYY-MM-DD HH:mm:ss');
          //   }
          // }
          // console.log(item.execution_start_time, item.start_time, item.update_time)
          return newItem;
        });
        setResponse(dlmsCommandHistoryResponse.data.result.results);
        setTotalCount(dlmsCommandHistoryResponse.data.result.count);
      } else {
        setErrorMessage('Network Error, please retry');
      }
    }
  }, [dlmsCommandHistoryResponse]);

  //console.log(response, 'command history response');

  // useEffect(() => {
  //   if (tapCommandHistoryResponse) {
  //     let statusCode = tapCommandHistoryResponse?.data?.responseCode;
  //     if (statusCode) {
  //       if (statusCode === 401 || statusCode === 403) {
  //         setLogout(true);
  //       } else if (statusCode === 200 || statusCode === 204) {
  //         setResponse(tapCommandHistoryResponse?.data?.data?.result?.results);
  //         setTotalCount(tapCommandHistoryResponse?.data?.data?.result?.count);
  //         props.doNotRefreshCommandHistory();
  //       } else {
  //         setErrorMessage('Network Error, please retry');
  //       }
  //     }
  //   }
  // }, [tapCommandHistoryResponse]);

  // const fetchHistoryDataDetail = async (params) => {
  //   return await useJwt
  //     .commandHistoryTAPDetail(params)
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

  const showData = (row) => {
    const params = {
      id: row.id,
    };
    getDlmsHistoryData(params);
    setCenteredModal(true);
    let statusCode = dlmsHistoryDataResponse?.data?.responseCode;
    if (statusCode === 200 || statusCode === 202) {
      let data = dlmsHistoryDataResponse?.data?.data?.result?.data;
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

      const cmdDetail = `Meter: ${row.meter_number}, Command: ${row.command}, Execution: ${row.start_time}`;
      const newData = {
        data,
        cmd_detail: cmdDetail,
      };
      setCommandName(row.command);
      setRowExecutionStatus(row);
      setCommandSelectedToViewResponse(row.command);
      setHistyData(newData);
    }
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
        name: 'Response Time',
        width: '140px',
        position: 5,
        cell: (row) => {
          if (!['Success', 'Failed'].includes(row.execution_status)) {
            return <>-</>;
          }
          if (row.execution_start_time && row.update_time) {
            const timeDifferenceInSeconds = moment(row.update_time).diff(
              row.execution_start_time,
              'seconds'
            );
            const hours = Math.floor(timeDifferenceInSeconds / 3600);
            const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
            const seconds = timeDifferenceInSeconds % 60;
            return (
              <>
                {hours ? `${hours} ${hours === 1 ? 'hr' : 'hrs'}` : ''}{' '}
                {minutes ? `${minutes} min` : ''} {`${seconds} sec`}
              </>
            );
          } else {
            return <>N/A</>;
          }
        },
      });
      if (props.protocol === 'dlms') {
        columns.push({
          name: 'Action',
          maxWidth: '100px',
          style: {
            minHeight: '40px',
            maxHeight: '40px',
          },
          cell: (row) => {
            if (
              row.execution_status === 'IN_PROGRESS' ||
              row.execution_status === 'INITIATE' ||
              row.execution_status === 'IN_QUEUE' ||
              row.execution_status === 'Initiate' ||
              row.execution_status === 'In Queue' ||
              row.execution_status === 'In Progress' ||
              row.execution_status === 'In PROGRESS' ||
              row.execution_status === 'In QUEUE'
            ) {
              return (
                <Eye
                  size="20"
                  className="ml-1 cursor-not-allowed  text-secondary"
                />
              );
            } else {
              return (
                <Eye
                  size="20"
                  className="ml-1 cursor-pointer"
                  onClick={() => showData(row)}
                />
              );
            }
          },
        });
      }

      if (props.protocol === 'tap') {
        columns.push({
          name: 'Action',
          maxWidth: '100px',
          style: {
            minHeight: '40px',
            maxHeight: '40px',
          },
          cell: (row) => {
            return (
              <Eye
                size="20"
                className="ml-1 cursor-pointer"
                // onClick={() => showTapData(row)}
              />
            );
          },
        });
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
            {i + 1 + 10 * (currentPage - 1)}
          </div>
        );
      },
    });
    return sortedColumns;
  }

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '12px !important',
        backgroundColor: 'inherit',
        '&:nth-child(1)': {
          position: 'sticky',
          left: 0,
          zIndex: 1,
          borderRight: '1px solid rgba(0, 0, 0, 0.11)',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '12px !important',
        backgroundColor: 'inherit',
        '&:nth-child(1)': {
          position: 'sticky',
          left: 0,
          zIndex: 1,
          borderRight: '1px solid rgba(0, 0, 0, 0.11)',
        },
      },
    },
  };

  const isArray = (a) => {
    return !!a && a.constructor === Array;
  };

  const eventsRelated = (info) => {
    if (info === 'CEFV') {
      return 'Current Related Events';
    } else if (info === 'VEFV') {
      return 'Voltage Related Events';
    } else if (info === 'PEFV') {
      return 'Power Related Events';
    } else if (info === 'TEFV') {
      return 'Transaction Related events';
    } else if (info === 'NREFV') {
      return 'Non Rollover Related Event';
    } else if (info === 'DEFV') {
      return 'Control Related events';
    } else if (info === 'OEFV') {
      return 'Other Related events';
    } else {
      return '';
    }
  };
  const commandSequence = {
    meter_current_datetime: 'RTC',
    meter_number: 'meter_number',
    voltage: 'Voltage_(V)',
    phase_current: 'Phase_Current_(A)',
    neutral_current: 'Neutral_Current_(A)',
    PF: 'Signed_Power_Factor',
    frequency: 'Frequency_(Hz)',
    apparent_power_VA: 'Apparent_Power_KVA',
    active_power_W: 'Active_Power_kW',
    import_Wh: 'Cum._Active_Imp._Energy_(kWh)',
    import_VAh: 'Cum._Apparent_Imp._Energy_(kVAh)',
    MD_W: 'MD_KW',
    MD_W_datetime: 'MD_(kW)_Date_&_Time',
    MD_VA: 'MD_KVA',
    MD_VA_datetime: 'MD_(kVA)_Date_&_Time',
    cumm_power_on_dur_minute: 'Cumulative_Power_ON_Duration_(Minute)',
    cumm_tamper_count: 'Cumulative_Tamper_Count',
    cumm_billing_count: 'Cumulative_Billing_Count',
    cumm_programming_count: 'Cumulative_Programming_Count',
    export_Wh: 'Cum._Active_Exp._Energy_(kWh)',
    export_VAh: 'Cum._Apparent_Exp._Energy_(kVAh)',
    load_limit_func_status: 'Load_Limit_Function_Status_(1=Closed)_(0=Open)',
    load_limit_value: 'Load_Limit_Value_(kW)',
    data_type: 'data_type',
  };

  const key_sequence = [
    'RTC',
    'meter_number',
    'Voltage_(V)',
    'Phase_Current_(A)',
    'Neutral_Current_(A)',
    'Signed_Power_Factor',
    'Frequency_(Hz)',
    'Apparent_Power_KVA',
    'Active_Power_kW',
    'Cum._Active_Imp._Energy_(kWh)',
    'Cum._Apparent_Imp._Energy_(kVAh)',
    'MD_KW',
    'MD_(kW)_Date_&_Time',
    'MD_KVA',
    'MD_(kVA)_Date_&_Time',
    'Cumulative_Power_ON_Duration_(Minute)',
    'Cumulative_Tamper_Count',
    'Cumulative_Billing_Count',
    'Cumulative_Programming_Count',
    'Cum._Active_Exp._Energy_(kWh)',
    'Cum._Apparent_Exp._Energy_(kVAh)',
    'Load_Limit_Function_Status_(1=Closed)_(0=Open)',
    'Load_Limit_Value_(kW)',
    'data_type',
  ];
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
            commandName === 'PROFILE_INSTANT' &&
            rowExecutionStatus.execution_status === 'Success' ? (
              key_sequence.map((info, index) => {
                const infoKey = Object.keys(commandSequence).find(
                  (key) => commandSequence[key] === info
                );
                if (
                  !infoKey ||
                  (commandName === 'NAME_PLATE_DETAIL' &&
                    infoKey === 'data_type')
                ) {
                  return null;
                }

                return (
                  <Row key={index}>
                    <Col sm="4" className="text-right border py-1">
                      {`${info.charAt(0).toUpperCase()}${info.slice(
                        1
                      )}`.replaceAll('_', ' ')}
                    </Col>
                    <Col sm="8" className="border py-1">
                      <h5 className="m-0">{data[infoKey]}</h5>
                    </Col>
                  </Row>
                );
              })
            ) : (
              Object.keys(data).map((info, index) => {
                if (
                  commandName === 'NAME_PLATE_DETAIL' &&
                  info === 'data_type'
                ) {
                  return null;
                }
                return (
                  <Row key={index}>
                    <Col sm="4" className="text-right border py-1">
                      {`${info.charAt(0).toUpperCase()}${info.slice(
                        1
                      )}`.replaceAll('_', ' ')}
                    </Col>
                    <Col sm="8" className="border py-1">
                      <h5 className="m-0">{data[info]}</h5>
                    </Col>
                  </Row>
                );
              })
            )
          ) : (
            <h3 className="text-center">No data found</h3>
          )}
        </Col>
      ) : (
        <Col sm="12" className="mb-3">
          {data.length > 0 ? (
            Object.keys(tableData).map((info, index) => {
              return (
                <SimpleTableForDLMSCommandResponse
                  key={index}
                  data={tableData[info]}
                  smHeading={true}
                  height="max"
                  tableName={
                    eventsRelated(info)
                      ? ` ${historyData.cmd_detail} {${eventsRelated(info)}}`
                      : `${historyData.cmd_detail}`
                  }
                  rowCount={10}
                  commandName={commandSelectedToViewResponse}
                />
              );
            })
          ) : (
            <h3 className="text-center">No data found</h3>
          )}
        </Col>
      )
    ) : (
      ''
    );
  };

  const execStatus = (data) => {
    return data ? (
      <Col sm="6" className="mt-2">
        <h3 className="mb-2">Arguments</h3>
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
                <h5 className="m-0">{JSON.stringify(data[info])}</h5>
              </Col>
            </Row>
          ))
        ) : (
          <h3 className="text-center">No data found</h3>
        )}
      </Col>
    ) : (
      ''
    );
  };

  const execTimeLine = (data) => {
    const resp_data = [];
    for (const i of data) {
      resp_data.push({
        title: i['execution_status'],
        meta: i['timestamp'],
      });
    }

    return data ? (
      <Col sm="6" className="mt-2">
        <h3 className="mb-2">Execution timeline</h3>
        {/* <Timeline data={resp_data} /> */}
      </Col>
    ) : (
      ''
    );
  };

  const fullInfo = () => {
    if (
      histyData &&
      histyData.hasOwnProperty('data') &&
      Array.isArray(histyData.data)
    ) {
      histyData.data.map((item) => {
        if (
          item.hasOwnProperty('avg_current') ||
          item.hasOwnProperty('measured_current')
        ) {
          item.avg_current = Number(item.avg_current).toFixed(2);
          item.measured_current = Number(item.measured_current).toFixed(2);
        }
      });
    }
    return (
      <Row>
        {histyData ? historyData(histyData) : ''}
        {/* {histyData ? execStatus(histyData.arguments) : ''} */}
        {/*   {histyData ? execTimeLine(histyData.execution_timeline) : ''} */}
      </Row>
    );
  };

  const onNextPageClicked = (page) => {
    setCurrentPage(page + 1);
  };

  // ** Function to handle Modal toggle
  const handleFilter = () => setFilterModal(!filterModal);
  // ** Custom close btn
  const CloseBtn = (
    <X className="cursor-pointer mt_5" size={15} onClick={handleFilter} />
  );

  // custom Close Button for Report Download Modal
  const CloseBtnForReportDownload = (
    <X
      className="cursor-pointer mt_5"
      size={15}
      onClick={handleReportDownloadModal}
    />
  );

  const commandRetryConfiguration = () => {
    return (
      <Fragment>
        <Layers
          className="ml-1 float-right icon-fixed-size"
          id="cmdRetries"
          size="18"
          onClick={() => setCommandRetryConfigModal(true)}
        />
        <UncontrolledTooltip placement="top" target="cmdRetries">
          Command Retry Configuration
        </UncontrolledTooltip>
      </Fragment>
    );
  };

  const retryAgain = () => {
    fetchCommandHistory();
  };

  const tapViewDetail = () => {
    return (
      <div style={{ fontSize: '12px' }}>
        Meter serial : <b>{tapHistyData.cmd_detail.meter_serial}</b>
        <br></br>
        Command : <b>{tapHistyData.cmd_detail.command}</b>
        <br></br>
        Execution time : <b>{tapHistyData.cmd_detail.execution}</b>
        <br></br>
        <br></br>
        Command response: <b>{tapHistyData.data}</b>
      </div>
    );
  };

  return (
    <div>
      {hasError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { loading },
          }}
        />
      ) : (
        <>
          {loading && <Loader hight="min-height-475" />}
          {!loading && (
            <div className="table-wrapper">
              <DataTableV1
                columns={createColumns()}
                data={response}
                rowCount={10}
                tableName={tableName}
                showDownloadButton={true}
                showRefreshButton={true}
                refreshFn={fetchCommandHistory}
                showAddButton={false}
                currentPage={currentPage}
                totalRowsCount={totalCount}
                onPageChange={onNextPageClicked}
                isLoading={loading}
                customStyles={customStyles}
                //setShowForm={setShowForm}
                pointerOnHover={true}
                filter={!props.params && handleFilter}
                extraTextToShow={commandRetryConfiguration()}
                protocolSelected={protocolSelected}
                protocol={props.protocol}
                handleReportDownloadModal={handleReportDownloadModal}
                isDownloadModal={props.protocol === 'dlms' ? 'yes' : ''}
                //onDownload={onDownload}
              />
            </div>
          )}
        </>
      )}

      {/* Command History data modal (Protocol 1)*/}
      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className={`modal_size modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          Command History data
        </ModalHeader>
        <ModalBody>{fullInfo()}</ModalBody>
      </Modal>

      {/* Command History data modal (Protocol 2)*/}
      <Modal
        isOpen={tapViewModal}
        toggle={() => setTapViewModal(!tapViewModal)}
        className={`modal-dialog-centered`}
      >
        <ModalHeader toggle={() => setTapViewModal(!tapViewModal)}>
          Protocol 2 command response detail
        </ModalHeader>
        <ModalBody>{tapHistyData && tapViewDetail()}</ModalBody>
      </Modal>

      {/* scheduler modal */}
      <Modal
        isOpen={centeredSchedulerModal}
        toggle={() => setCenteredSchedulerModal(!centeredSchedulerModal)}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader
          toggle={() => setCenteredSchedulerModal(!centeredSchedulerModal)}
        >
          List Of Schedulers
        </ModalHeader>
        <ModalBody className="p-0">{/* <SchedulerList /> */}</ModalBody>
      </Modal>

      {/* Command Retry Configuration For Protocol 1 Modal */}
      <Modal
        isOpen={commandRetryConfigModal}
        toggle={() => setCommandRetryConfigModal(!commandRetryConfigModal)}
        className={`modal-xl modal-dialog-centered`}
      >
        <ModalHeader
          toggle={() => setCommandRetryConfigModal(!commandRetryConfigModal)}
        >
          Command Retry Configuration
        </ModalHeader>
        <ModalBody className="p-0">
          {' '}
          <CommandRetryConfig />
        </ModalBody>
      </Modal>

      {/* Command filter modal (Protocol 1 & 2) */}
      <Modal
        isOpen={filterModal}
        toggle={handleFilter}
        className="sidebar-md"
        modalClassName="modal-slide-in-left"
        contentClassName="pt-0"
      >
        <ModalHeader
          style={{ display: 'flex', justifyContent: 'space-between' }}
          className="d-flex mb-3"
          toggle={handleFilter}
          close={CloseBtn}
          tag="div"
        >
          <h4 className="modal-title">Command history - Filter</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <FilterForm
            handleFilter={handleFilter}
            protocol={props.protocol}
            AppliedFilterparams={AppliedFilterparams}
            filterAppliedParams={filterAppliedParams}
            selectedAssetType={selectedAssetType}
            setSelectedAssetType={setSelectedAssetType}
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
          className="mb-3"
          style={{ display: 'flex', justifyContent: 'space-between' }}
          toggle={handleReportDownloadModal}
          close={CloseBtnForReportDownload}
          tag="div"
        >
          <h4 className="modal-title">Download (Command History Data)</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1">
          <CommandHistoryDataDownloadWrapper />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CommandHistory;
