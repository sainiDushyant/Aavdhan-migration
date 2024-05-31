import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { selectThemeColors } from '../../../../../../utils';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Row,
  Badge,
  UncontrolledTooltip,
} from 'reactstrap';
//import SimpleDataTablePaginated from '../../../../../../components/dtTable/simpleTablePaginated';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';
import { caseInsensitiveSort } from '../../../../../../utils';

import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Loader from '../../../../../../components/loader/loader';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import { toast } from 'react-toastify';
import { Download } from 'react-feather';
import {
  useLazyDLMSDataDownloadRequestQuery,
  useGetDLMSDataDownloadRequestHistoryQuery,
} from '../../../../../../api/hes/command-historySlice';

const CommandHistoryDataDownloadWrapper = () => {
  const location = useLocation();
  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const [selectedSite, setSelectedSite] = useState(undefined);
  const [selectedMeter, setSelectedMeter] = useState(undefined);
  const [commandSelected, setCommandSelected] = useState(undefined);
  const [cmdStatusSelected, setCmdStatusSelected] = useState(undefined);
  const [dtrList, setDtrList] = useState([]);

  const [disableDtrSelection, setDisableDtrSelection] = useState(false);
  const [disableMeterSelection, setDisableMeterSelection] = useState(false);

  //const [loader, setLoader] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(120);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState([]);

  const responseDLSMCommandList = useSelector(
    (state) => state.utilityMDASDlmsCommand
  );
  const responseAssetList = useSelector(
    (state) => state.utilityMDASAssetList.responseData.dtr_list
  );

  // Command Status DLMS

  // DTR List
  useEffect(() => {
    if (responseAssetList) {
      const dtr_list = responseAssetList.map((e) => {
        return { value: e.dtr_id, label: e.dtr_name };
      });
      setDtrList(dtr_list);
    }
  }, []);

  let params = {};
  params = { page: currentPage, page_size: pageSize, projectName };

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  //RTK Query hooks for data fetching

  const {
    data: dlmsDownloadRequestHistoryResponse,
    isFetching: dlmsDownloadRequestHistoryLoading,
    isError: dlmsDownloadRequestHistoryError,
    refetch: fetchDownloadRequestHistory,
  } = useGetDLMSDataDownloadRequestHistoryQuery(params);

  const loading = dlmsDownloadRequestHistoryLoading;
  const hasError = dlmsDownloadRequestHistoryError;

  const [requestReport, requestReportResponse] =
    useLazyDLMSDataDownloadRequestQuery();

  useEffect(() => {
    const statusCode = dlmsDownloadRequestHistoryResponse?.responseCode;
    if (statusCode === 200) {
      setTotalCount(dlmsDownloadRequestHistoryResponse?.data?.result?.count);
      setResponse(dlmsDownloadRequestHistoryResponse?.data?.result?.results);
    } else {
      setErrorMessage('Network Error, please retry');
    }
  }, [dlmsDownloadRequestHistoryResponse]);

  const execution_status_dlms = [
    {
      value: 'INITIATE',
      label: 'INITIATE',
    },
    {
      value: 'IN_QUEUE',
      label: 'IN_QUEUE',
    },
    {
      value: 'IN_PROGRESS',
      label: 'IN_PROGRESS',
    },
    {
      value: 'SUCCESS',
      label: 'SUCCESS',
    },
    {
      value: 'FAILED',
      label: 'FAILED',
    },
  ];

  function createColumns() {
    const columns = [];
    const ignoreColumns = ['id', 'sc_no', 'parameter', 'project', 'csv_url'];
    const disableSortings = [
      'site id',
      'Parameter',
      'Command',
      'Current status',
      'Created at',
    ];

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
          column.minWidth = '200px';
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
        name: 'Status',
        width: '120px',
        cell: (row) => {
          if (row.execution_status === 'Success') {
            return (
              <>
                <Badge pill color="success">
                  {row.execution_status}
                </Badge>
              </>
            );
          } else if (row.execution_status === 'In_Progress') {
            return (
              <>
                <Badge pill color="warning">
                  {row.execution_status}
                </Badge>
              </>
            );
          } else if (row.execution_status === 'Failed') {
            return (
              <>
                <Badge pill color="danger">
                  {row.execution_status}
                </Badge>
              </>
            );
          }
        },
      });
      columns.push({
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
    const sortedColumns = columns.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      } else if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
    return sortedColumns;
  }

  const onDTRSelected = (val) => {
    if (val) {
      setSelectedSite(val);
      setDisableMeterSelection(true);
      setSelectedMeter(undefined);
    } else {
      setSelectedSite(undefined);
      setDisableMeterSelection(false);
    }
  };

  const onCommandStatusSelected = (val) => {
    if (val) {
      setCmdStatusSelected(val);
    } else {
      setCmdStatusSelected(undefined);
    }
  };

  const onCommandSelected = (val) => {
    if (val) {
      setCommandSelected(val);
    } else {
      setCommandSelected(undefined);
    }
  };

  const onMeterSerialNumberEntered = (val) => {
    // console.log(val)
    // console.log(val.target.value)

    if (val && val.target.value.length > 0) {
      setSelectedSite(undefined);
      setDisableDtrSelection(true);
      setSelectedMeter(val.target.value);
    } else {
      setSelectedMeter(undefined);
      setDisableDtrSelection(false);
    }
  };

  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };
  const reloadData = () => {
    setCurrentPage(1);
    fetchDownloadRequestHistory();
  };

  const onSubmitButtonClicked = async () => {
    const params = {};
    params['project'] = projectName;
    if (selectedMeter) {
      params['meter'] = selectedMeter;
    } else {
      params['meter'] = '';
    }

    if (selectedSite) {
      params['site'] = selectedSite.value;
    } else {
      params['site'] = '';
    }

    if (commandSelected) {
      params['command'] = commandSelected.value;
    } else {
      params['command'] = '';
    }

    if (cmdStatusSelected) {
      params['command_status'] = cmdStatusSelected.value;
    } else {
      params['command_status'] = '';
    }

    requestReport(params);
  };

  useEffect(() => {
    if (requestReportResponse.isSuccess) {
      const statusCode = requestReportResponse?.currentData?.responseCode;
      if (statusCode === 200) {
        fetchDownloadRequestHistory();
        toast('Request submitted successfully ....', {
          hideProgressBar: true,
          type: 'success',
        });
      } else {
        toast(
          'Something went wrong please retry .....',

          { hideProgressBar: true, type: 'warning' }
        );
      }
    }
  }, [requestReportResponse]);
  const retryAgain = () => {
    fetchDownloadRequestHistory();
  };

  return (
    <>
      <Row className="mb-2">
        {/* Select Site ID*/}
        <Col className="mb-1" xl="3" md="6" sm="12">
          <Select
            id="selectdtr"
            name="dtr"
            // key={`my_unique_select_key__${pssSelected}`}
            theme={selectThemeColors}
            className="react-select zindex_1001"
            classNamePrefix="select"
            // value={pssSelected}
            closeMenuOnSelect={true}
            onChange={onDTRSelected}
            options={dtrList}
            isClearable={true}
            isDisabled={disableDtrSelection}
            placeholder="Select Site Name"
          />
        </Col>

        {/* Select Command Name*/}
        <Col className="mb-1" xl="3" md="6" sm="12">
          <Select
            id="selectcommand"
            name="command"
            // key={`my_unique_select_key__${feederSelected}`}
            isClearable={true}
            theme={selectThemeColors}
            className="react-select"
            classNamePrefix="select"
            // value={feederSelected}
            onChange={onCommandSelected}
            closeMenuOnSelect={true}
            options={responseDLSMCommandList.responseData}
            // isDisabled={isPssSelected}
            placeholder="Select Command"
          />
        </Col>

        {/* Select Command Status*/}
        <Col className="mb-1" xl="3" md="6" sm="12">
          <Select
            id="selectcommandstatus"
            name="commandstatus"
            // key={`my_unique_select_key__${dtrSelected}`}
            isClearable={true}
            closeMenuOnSelect={true}
            theme={selectThemeColors}
            // value={dtrSelected}
            onChange={onCommandStatusSelected}
            options={execution_status_dlms}
            // isDisabled={isPssSelected}
            className="react-select zindex_1000"
            classNamePrefix="select"
            placeholder="Select Command Status"
          />
        </Col>

        <Col className="mb-1" xl="3" md="6" sm="12">
          <FormGroup>
            <Input
              type="text"
              id="Consumer Serial No."
              placeholder="Consumer Number..."
              onChange={onMeterSerialNumberEntered}
              disabled={disableMeterSelection}
            />
          </FormGroup>
        </Col>
        <Col lg="2" md="4" xs="6">
          <Button
            color="primary"
            className="btn-block"
            onClick={onSubmitButtonClicked}
          >
            Submit
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader hight="min-height-330" />
      ) : hasError ? (
        <CardInfo
          props={{
            message: { errorMessage },
            retryFun: { retryAgain },
            retry: { loading },
          }}
        />
      ) : (
        !loading && (
          <DataTableV1
            columns={createColumns()}
            data={response}
            rowCount={pageSize}
            setRowCount={setRowCount}
            tableName={'Command History Download Request'}
            showDownloadButton={true}
            showRefreshButton={true}
            refreshFn={reloadData}
            showAddButton={false}
            currentPage={currentPage}
            totalRowsCount={totalCount}
            onPageChange={onNextPageClicked}
            isLoading={loading}
            //setShowForm={setShowForm}
            pointerOnHover={true}
            //onDownload={onDownload}
          />
        )
      )}

      {/* <DataTable columns={tblColumn(tableData)} tblData={tableData} rowCount={10} tableName={'Download Table'} donotShowDownload={true} /> */}
    </>
  );
};

export default CommandHistoryDataDownloadWrapper;
