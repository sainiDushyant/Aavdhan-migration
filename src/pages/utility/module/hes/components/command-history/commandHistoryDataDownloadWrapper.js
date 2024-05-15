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
import SimpleDataTablePaginated from '../../../../../../components/dtTable/simpleTablePaginated';

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
} from '../../../../../../api/command-historySlice';

const CommandHistoryDataDownloadWrapper = () => {
  // Logout User
  const [logout, setLogout] = useState(false);
  // useEffect(() => {
  //   if (logout) {
  //     authLogout(history, dispatch)
  //   }
  // }, [logout])

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

  const params = {};
  params['page'] = currentPage;
  params['page_size'] = pageSize;
  params['project'] = projectName;

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
    } else if (statusCode === 401 || statusCode === 403) {
      setLogout(true);
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
      } else if (statusCode === 401 || statusCode === 403) {
        setLogout(true);
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
          <SimpleDataTablePaginated
            columns={tblColumn()}
            tblData={response}
            rowCount={pageSize}
            tableName={'Command History Download Request'}
            refresh={reloadData}
            currentPage={currentPage}
            totalCount={totalCount}
            onNextPageClicked={onNextPageClicked}
            // showRequestDownloadModal={true}
            // handleReportDownloadModal={handleReportDownloadModal}
          />
        )
      )}

      {/* <DataTable columns={tblColumn(tableData)} tblData={tableData} rowCount={10} tableName={'Download Table'} donotShowDownload={true} /> */}
    </>
  );
};

export default CommandHistoryDataDownloadWrapper;
