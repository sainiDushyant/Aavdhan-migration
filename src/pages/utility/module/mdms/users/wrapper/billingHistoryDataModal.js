import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
} from 'reactstrap';
import moment from 'moment';
import Loader from '../../../../../../components/loader/loader';
import { useLocation } from 'react-router-dom';

import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { selectThemeColors } from '../../../../../../utils';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import { useLazyGetMDMSGroupMeterBillingHistoryDataQuery } from '../../../../../../api/mdms/loadSlice';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const BillingHistoryDataModal = (props) => {
  const location = useLocation();
  const projectName = location.pathname.split('/')[2];

  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');

  const [response, setResponse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  const [startDateTime, setStartDateTime] = useState(undefined);
  const [startDateTimeAsPerFormat, setStartDateTimeAsPerFormat] =
    useState(undefined);

  const [endDateTime, setEndDateTime] = useState(undefined);
  const [endDateTimeAsPerFormat, setEndDateTimeAsPerFormat] =
    useState(undefined);

  const [selectDataPosition, setSelectDataPosition] = useState(1);

  //   console.log("Hierarchy Progress ....")
  //   console.log(HierarchyProgress)

  let project = projectName;
  let site = '';
  let site_real_name = '';

  if (hierarchy && hierarchy.dtr_name) {
    site = hierarchy.dtr_name;
  }
  if (hierarchy && hierarchy.dtr_real_name) {
    site_real_name = hierarchy.dtr_real_name;
  }

  const setRowCount = (rowCount) => {
    setPageSize(rowCount);
  };

  const getParams = () => {
    let params;
    if (startDateTimeAsPerFormat && endDateTimeAsPerFormat) {
      params = {
        project,
        site,
        page: currentPage,
        page_size: pageSize,
        data_state: selectDataPosition,
        start_date: startDateTimeAsPerFormat,
        end_date: endDateTimeAsPerFormat,
      };
    } else {
      params = {
        project,
        site,
        page: currentPage,
        page_size: pageSize,
        data_state: selectDataPosition,
      };
    }
    return params;
  };

  const [fetchBillingHistory, data] =
    useLazyGetMDMSGroupMeterBillingHistoryDataQuery();

  useEffect(() => {
    fetchBillingHistory(getParams(), { preferCacheValue: true });
  }, [pageSize]);

  useEffect(() => {
    if (data.status === 'fulfilled') {
      let statusCode = data.currentData.responseCode;
      if (statusCode === 200) {
        const command_sequence = {
          billing_datetime: 'Billing_Date',
          systemPF: 'Average_Power_Factor_For_Billing_Period',
          kwhSnap: 'Cum._Active_Imp._Energy_(kWh)',
          import_Wh_TOD_1: 'Cum._Active_Imp._Energy_(kWh)_T1',
          import_Wh_TOD_2: 'Cum._Active_Imp._Energy_(kWh)_T2',
          import_Wh_TOD_3: 'Cum._Active_Imp._Energy_(kWh)_T3',
          import_Wh_TOD_4: 'Cum._Active_Imp._Energy_(kWh)_T4',
          kvahSnap: 'Cum._Apparent_Imp._Energy_(kVAh)',
          import_VAh_TOD_1: 'Cum._Apparent_Imp._Energy_(kVAh)_T1',
          import_VAh_TOD_2: 'Cum._Apparent_Imp._Energy_(kVAh)_T2',
          import_VAh_TOD_3: 'Cum._Apparent_Imp._Energy_(kVAh)_T3',
          import_VAh_TOD_4: 'Cum._Apparent_Imp._Energy_(kVAh)_T4',
          MDKwh: 'MD_kW',
          MDKwhTS: 'MD_kW_with_Date/Time',
          MDKvah: 'MD_kVA',
          MDKvahTS: 'MD_kVA_with_Date/Time',
          billingDuration: 'Billing_Power_ON_Duration_(Minutes)',
          kwhSnapExport: 'Cum._Active_Exp._Energy_(kWh)',
          kvahSnapExport: 'Cum._Apparent_Exp._Energy_(kVAh)',
          reporting_timestamp: 'report_timestamp',
        };

        const keysToConvertWh = [
          'MD_kW',
          'Average_Power_Factor_For_Billing_Period',
          'Cum._Active_Imp._Energy_(kWh)',
          'Cum._Active_Imp._Energy_(kWh)_T1',
          'Cum._Active_Imp._Energy_(kWh)_T2',
          'Cum._Active_Imp._Energy_(kWh)_T3',
          'Cum._Active_Imp._Energy_(kWh)_T4',
          'Cum._Active_Exp._Energy_(kWh)',
        ];
        const keysToConvertVAh = [
          'MD_kVA',
          'Cum._Apparent_Imp._Energy_(kVAh)',
          'Cum._Apparent_Imp._Energy_(kVAh)_T1',
          'Cum._Apparent_Imp._Energy_(kVAh)_T2',
          'Cum._Apparent_Imp._Energy_(kVAh)_T3',
          'Cum._Apparent_Imp._Energy_(kVAh)_T4',
          'Cum._Apparent_Exp._Energy_(kVAh)',
        ];

        const billingDataResponse = [];
        const results = response?.data?.data?.result?.GP;
        for (let i = 0; i < results?.length; i++) {
          const item = results[i];

          // Check if item is an object (not an array)
          if (typeof item === 'object' && item !== null) {
            // Update keys according to the mapping
            for (const key in item) {
              if (command_sequence.hasOwnProperty(key)) {
                const commandSequence = command_sequence[key];

                if (keysToConvertWh.includes(commandSequence)) {
                  // Convert from Wh to kWh
                  item[commandSequence] = item[key] / 1000;
                  if (item[key] !== 0) {
                    item[commandSequence] = item[commandSequence]?.toFixed(4);
                  }
                } else if (keysToConvertVAh.includes(commandSequence)) {
                  // Convert from VAh to kVAh
                  item[commandSequence] = item[key] / 1000;
                  if (item[key] !== 0) {
                    item[commandSequence] = item[commandSequence]?.toFixed(4);
                  }
                } else {
                  // If not conversion needed, keep the original value
                  item[commandSequence] = item[key];
                }
                // If the key is different from the mapped key, delete it
                if (commandSequence !== key) {
                  delete item[key];
                }
              }
              // Replace placeholder value "--" with empty string
              if (item[key] === '65535-00-00 00:00:00') {
                item[key] = '--';
              }
            }
            // console.log(billingDataResponse)
            billingDataResponse.push(item);
          }
        }
        setResponse(billingDataResponse);
      }
    } else if (data.isError) {
      setErrorMessage('Something went wrong, please retry');
    }
  }, [data]);

  const reloadData = () => {
    fetchBillingHistory(getParams());
  };

  const dateTimeFormat = (inputDate) => {
    return ''.concat(
      inputDate.getFullYear(),
      '-',
      (inputDate.getMonth() + 1).toString().padStart(2, '0'),
      '-',
      inputDate.getDate().toString().padStart(2, '0'),
      ' ',
      inputDate.getHours().toString().padStart(2, '0'),
      ':',
      inputDate.getMinutes().toString().padStart(2, '0'),
      ':',
      inputDate.getSeconds().toString().padStart(2, '0')
    );
  };

  const onStartTimeSelected = (time) => {
    // console.log("Start Time Selected ...")
    // console.log(time[0])
    // console.log("As per date time format ....")
    // console.log(dateTimeFormat(time[0]))
    setStartDateTime(time[0]);
    setStartDateTimeAsPerFormat(dateTimeFormat(time[0]));
  };

  const onEndTimeSelected = (time) => {
    // console.log("End Time Selected ...")
    // console.log(time[0])
    // console.log("As per date time format ....")
    // console.log(dateTimeFormat(time[0]))
    setEndDateTime(time[0]);
    setEndDateTimeAsPerFormat(dateTimeFormat(time[0]));
  };

  const onDataPositionSelected = (position) => {
    // console.log("Position Selected ...")
    // console.log(position['value'])
    setSelectDataPosition(position['value']);
  };

  const onSubmitButtonClicked = () => {
    if (startDateTimeAsPerFormat && !endDateTimeAsPerFormat) {
      // Set End Time Error
      toast('Please Select End Time', {
        hideProgressBar: true,
      });
    } else if (!startDateTimeAsPerFormat && endDateTimeAsPerFormat) {
      // Set Start Time Error
      toast('Please Select Start Time', {
        hideProgressBar: true,
        type: 'warning',
      });
    } else if (startDateTimeAsPerFormat && endDateTimeAsPerFormat) {
      // Both Time are set Compare
      if (startDateTimeAsPerFormat > endDateTimeAsPerFormat) {
        toast('Start Date Time should be smaller than End Date Time', {
          hideProgressBar: true,
          type: 'warning',
        });
      } else {
        fetchBillingHistory(getParams());
      }
      // toast('Please enter meter serial.' type='danger' />, { hideProgressBar: true })
    } else {
      // Both the time are not set look for only data position value
      // toast.error(<Toast msg='Please enter meter serial.' type='danger' />, { hideProgressBar: true })
      fetchBillingHistory(getParams());
    }
  };

  const tblColumn = (data) => {
    const column = [];
    const custom_width = ['manufacturer_name', 'exec_datetime'];

    for (const i in data[0]) {
      const col_config = {};
      if (
        i !== 'id' &&
        i !== 'SM_device_id' &&
        i !== 'MD_W_TOD_1' &&
        i !== 'MD_W_TOD_2' &&
        i !== 'MD_W_TOD_3' &&
        i !== 'MD_W_TOD_4' &&
        i !== 'MD_W_TOD_1' &&
        i !== 'MD_VA_TOD_1' &&
        i !== 'MD_VA_TOD_2' &&
        i !== 'MD_VA_TOD_3' &&
        i !== 'MD_VA_TOD_4' &&
        i !== 'MD_W_TOD_1_datetime' &&
        i !== 'MD_W_TOD_2_datetime' &&
        i !== 'MD_W_TOD_3_datetime' &&
        i !== 'MD_W_TOD_4_datetime' &&
        i !== 'MD_VA_TOD_1_datetime' &&
        i !== 'MD_VA_TOD_2_datetime' &&
        i !== 'MD_VA_TOD_3_datetime' &&
        i !== 'MD_VA_TOD_4_datetime' &&
        i !== 'exec_datetime' &&
        i !== 'cumm_VARH_lead' &&
        i !== 'MD_W_datetime' &&
        i !== 'MD_VA_datetime'
      ) {
        col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
          1
        )}`.replaceAll('_', ' ');
        col_config.serch = i;
        col_config.selector = (row) => row[i];
        col_config.sortable = true;

        col_config.width = '190px';
        col_config.cell = (row) => {
          if (row[i] === undefined || row[i] === null) {
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{'-'}</span>
              </div>
            );
          } else if (i === 'from_push' && row[i] === true) {
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{'Yes'}</span>
              </div>
            );
          } else if (i === 'from_push' && row[i] === false) {
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{'No'}</span>
              </div>
            );
          } else
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{row[i]}</span>
              </div>
            );
        };
        column.push(col_config);
      }
    }
    column.unshift({
      name: 'Sr',
      width: '90px',
      cell: (row, i) => {
        return (
          <div className="d-flex  justify-content-center">
            {i + 1 + pageSize * (currentPage - 1)}
          </div>
        );
      },
    });
    return column;
  };
  const onNextPageClicked = (number) => {
    setCurrentPage(number + 1);
  };
  const showData = () => {
    if (Object.keys(response).length > 0) {
      return (
        <div className="table-wrapper">
          <DataTableV1
            columns={tblColumn(response)}
            data={response}
            rowCount={pageSize}
            setRowCount={setRowCount}
            tableName={'Billing History Data'}
            currentPage={currentPage}
            totalRowsCount={response?.length}
            onPageChange={onNextPageClicked}
            showDownloadButton={true}
            showRefreshButton={true}
            refreshFn={reloadData}
          />
        </div>
      );
    } else {
      return (
        <div className="table-wrapper">
          <DataTableV1
            data={[]}
            rowCount={8}
            tableName={'Billing History Data'}
            currentPage={currentPage}
            showDownloadButton={true}
            showRefreshButton={true}
            refreshFn={reloadData}
          />
        </div>
      );
    }
  };

  const retryAgain = () => {
    fetchBillingHistory(getParams());
  };

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.handleModalState(!props.isOpen)}
      scrollable
      className="modal_size"
    >
      <ModalHeader toggle={() => props.handleModalState(!props.isOpen)}>
        {props.title}
      </ModalHeader>
      <ModalBody>
        {data.isFetching ? (
          <Loader hight="min-height-484" />
        ) : (
          <div>
            <Row className="mb-2">
              <Col lg="3" xs="6">
                <Label className="form-label" for="date-time-picker">
                  Start Time
                </Label>
                <Flatpickr
                  placeholder="Start Datetime"
                  data-enable-time
                  id="date-time-picker"
                  className="form-control"
                  onChange={onStartTimeSelected}
                />
              </Col>

              <Col lg="3" xs="6">
                <Label className="form-label" for="date-time-picker">
                  End Time
                </Label>
                <Flatpickr
                  placeholder="End Datetime"
                  data-enable-time
                  id="date-time-picker"
                  className="form-control"
                  onChange={onEndTimeSelected}
                />
              </Col>

              <Col lg="4" xs="8">
                <Label className="form-label">Select</Label>
                <Select
                  closeMenuOnSelect={true}
                  theme={selectThemeColors}
                  // components={animatedComponents}
                  onChange={onDataPositionSelected}
                  options={[
                    {
                      label: '1',
                      value: '1',
                    },
                    {
                      label: '2',
                      value: '2',
                    },
                    {
                      label: '3',
                      value: '3',
                    },
                    {
                      label: '4',
                      value: '4',
                    },
                    {
                      label: '5',
                      value: '5',
                    },
                  ]}
                  className="react-select zindex_1000"
                  classNamePrefix="Select Data Position"
                  placeholder="Select Data Position"
                />
              </Col>
              <Col lg="2" xs="4">
                <Button
                  color="primary"
                  className="btn-block mt-2"
                  onClick={onSubmitButtonClicked}
                >
                  Submit
                </Button>
              </Col>
            </Row>
            {data.isError ? (
              <CardInfo
                props={{
                  message: { errorMessage },
                  retryFun: { retryAgain },
                  retry: { retry: data.isFetching },
                }}
              />
            ) : (
              <>{showData()}</>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default BillingHistoryDataModal;
