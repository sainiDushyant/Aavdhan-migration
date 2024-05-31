import { useState, useEffect } from 'react';
import Loader from '../../../../../../components/loader/loader';
import BillDetermineActionModal from './billDetermineActionModal';

import { toast } from 'react-toastify';

import { Row, Col, Button, InputGroup } from 'reactstrap';
import Flatpickr from 'react-flatpickr';

import { useSelector, useDispatch } from 'react-redux';

import { useLocation } from 'react-router-dom';
import { caseInsensitiveSort } from '../../../../../../utils';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import moment from 'moment';
import { useGetBillingDataQuery } from '../../../../../../api/hes/push-dataSlice';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const BillDetermine = () => {
  const location = useLocation();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  let user_name = '';
  let meter_serial = '';
  if (HierarchyProgress && HierarchyProgress.user_name) {
    user_name = HierarchyProgress.user_name;
    meter_serial = HierarchyProgress.meter_serial_number;
  }
  const [centeredModal, setCenteredModal] = useState(false);
  const [eventHistoryStartTime, setEventHistoryStartTime] = useState(undefined);
  const [eventHistoryEndTime, setEventHistoryEndTime] = useState(undefined);

  // Local State to manage Billing Determinant History
  const [BillingDeterminantHistory, setBillingDeterminantHistory] = useState(
    []
  );
  const [rowCount, setRowCount] = useState(10);
  const [page, setPage] = useState(1);

  const defaultStartDate = moment()
    .startOf('month')
    .format('YYYY-MM-DD 00:00:00');

  // Set default end date to the current date and time
  const defaultEndDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const [startDateTime, setStartDateTime] = useState(defaultStartDate);
  const [endDateTime, setEndDateTime] = useState(defaultEndDate);

  const [errorMessage, setErrorMessage] = useState('');
  const [skip, setSkip] = useState(false);

  const params = {
    project: project,
    page: page,
    page_size: rowCount,
    start_date: startDateTime,
    end_date: endDateTime,
    site: HierarchyProgress.dtr_name,
    meter: HierarchyProgress.meter_serial_number,
  };
  const setRowCounts = (pageSize) => {
    setRowCount(pageSize);
  };

  const { data, isFetching, status, isError, refetch } = useGetBillingDataQuery(
    params,
    { skip }
  );

  useEffect(() => {
    if (status === 'fulfilled') {
      let statusCode = data.responseCode;
      if (statusCode === 200) {
        const billingDataResponse = [];
        const results = data.data.result.results; // Assuming this is an array of objects

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
          date_timestamp: 'data_timestamp',
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

        for (let i = 0; i < results.length; i++) {
          const item = results[i].data;
          item.reporting_timestamp = results[i].report_timestamp;
          // Check if item is an object (not an array)
          if (typeof item === 'object' && item !== null) {
            if (item.hasOwnProperty('total_poweron_duraion_min')) {
              item['Total power on duration'] =
                item['total_poweron_duraion_min'];
              delete item['total_poweron_duraion_min'];
            }
            for (const key in item) {
              if (command_sequence.hasOwnProperty(key)) {
                const commandSequence = command_sequence[key];

                if (
                  keysToConvertWh &&
                  keysToConvertWh.includes(commandSequence)
                ) {
                  // Convert from Wh to kWh
                  item[commandSequence] = item[key] / 1000;
                  if (item[key] !== 0) {
                    item[commandSequence] = item[commandSequence]?.toFixed(4);
                  }
                } else if (
                  keysToConvertVAh &&
                  keysToConvertVAh.includes(commandSequence)
                ) {
                  // Convert from VAh to kVAh
                  item[commandSequence] = item[key] / 1000;
                  if (item[key] !== 0) {
                    item[commandSequence] = item[commandSequence]?.toFixed(4);
                  }
                } else {
                  item[commandSequence] = item[key];
                }
                // If the key is different from the mapped key, delete it
                if (commandSequence !== key) {
                  delete item[key];
                }
              }
              if (item[key] === '65535-00-00 00:00:00') {
                item[key] = '--';
              }
            }
            billingDataResponse.push(item);
          }
        }
        setBillingDeterminantHistory(billingDataResponse);
      }
    } else if (isError) {
      setErrorMessage('Something went wrong, please retry.');
    }
  }, [data, isError, status]);

  const tblColumn = () => {
    const column = [];
    const custom_width = [
      'BD_GENERATED_TIME',
      'from_datetime',
      'to_datetime',
      'MR_SCHEDULE_DATE',
      'READ_DATE',
      'actual_read_date',
      'MRU',
    ];

    if (BillingDeterminantHistory && BillingDeterminantHistory.length > 0) {
      for (const i in BillingDeterminantHistory[0]) {
        const col_config = {};
        if (i !== 'id' && i !== 'METER_NUMBER' && i !== 'meter_number') {
          col_config.name = `${i.charAt(0).toUpperCase()}${i.slice(
            1
          )}`.replaceAll('_', ' ');
          col_config.serch = i;
          col_config.sortable = true;
          col_config.wrap = true;
          col_config.selector = (row) => row[i];
          col_config.sortFunction = (rowA, rowB) =>
            caseInsensitiveSort(rowA, rowB, i);
          col_config.style = {
            minHeight: '40px',
            maxHeight: '40px',
          };

          col_config.width = '160px';

          col_config.cell = (row) => {
            return (
              <div className="d-flex">
                <span className="d-block font-weight-bold ">{row[i]}</span>
              </div>
            );
          };
          column.push(col_config);
        }
      }

      const showData = async (row) => {
        setEventHistoryStartTime(row['from_datetime']);
        setEventHistoryEndTime(row['to_datetime']);

        setCenteredModal(true);
      };

      column.unshift({
        name: 'Sr',
        width: '90px',
        cell: (row, i) => {
          return (
            <div className="d-flex  justify-content-center">
              {i + 1 + rowCount * (page - 1)}
            </div>
          );
        },
      });
      return column;
    }
  };
  const onNextPageClicked = (page) => {
    setPage(page + 1);
  };
  const retryAgain = () => {
    refetch();
  };

  const onDateRangeSelectedButtonPressed = () => {
    if (startDateTime && endDateTime) {
      setSkip(false);
      setPage(1);
    } else {
      toast('Please select Date and time.', {
        hideProgressBar: true,
        type: 'warning',
      });
    }
  };

  //

  const onDateRangeSelected = (dateRange) => {
    if (dateRange.length === 1) {
      setStartDateTime(moment(dateRange[0]).format('YYYY-MM-DD HH:mm:ss'));
      setEndDateTime(undefined);
      setSkip(true);
    } else if (dateRange.length === 2) {
      setStartDateTime(moment(dateRange[0]).format('YYYY-MM-DD HH:mm:ss'));
      setEndDateTime(moment(dateRange[1]).format('YYYY-MM-DD HH:mm:ss'));
      setSkip(true);
    }
  };

  return (
    <div>
      {isFetching ? (
        <Loader hight="min-height-484" />
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
          <>
            <Row className="justify-content-end mb-1">
              <Col md="5">
                <InputGroup>
                  <Flatpickr
                    placeholder="Select date ..."
                    onChange={onDateRangeSelected}
                    className="form-control"
                    value={[startDateTime, endDateTime]}
                    options={{
                      mode: 'range',
                      enableTime: true,
                      time_24hr: true,
                    }}
                  />
                  <Button
                    color="primary"
                    outline
                    onClick={onDateRangeSelectedButtonPressed}
                  >
                    Submit
                  </Button>
                </InputGroup>
              </Col>
            </Row>

            <DataTableV1
              columns={tblColumn()}
              data={BillingDeterminantHistory}
              rowCount={rowCount}
              setRowCount={setRowCounts}
              currentPage={page}
              onPageChange={onNextPageClicked}
              totalRowsCount={BillingDeterminantHistory?.length}
              tableName={`Billing Data Table (${meter_serial})`}
              showDownloadButton={true}
              showRefreshButton={true}
              refreshFn={retryAgain}
            />
          </>
        )
      )}
      {/* Show All the events for Billing determinants generated for time interval */}
      {centeredModal && (
        <BillDetermineActionModal
          isOpen={centeredModal}
          handleModal={setCenteredModal}
          eventHistoryStartTime={eventHistoryStartTime}
          eventHistoryEndTime={eventHistoryEndTime}
          txtLen={50}
        />
      )}
    </div>
  );
};

export default BillDetermine;
