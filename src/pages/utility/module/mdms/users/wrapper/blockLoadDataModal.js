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
import { useFetcher, useLocation } from 'react-router-dom';

import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { selectThemeColors } from '../../../../../../utils';
import CardInfo from '../../../../../../components/ui-elements/cards/cardInfo';
import { useLazyGetMDMSGroupMeterBlockLoadDataQuery } from '../../../../../../api/mdms/loadSlice';
import DataTableV1 from '../../../../../../components/dtTable/DataTableV1';

const BlockLoadDataModal = (props) => {
  const location = useLocation();
  const projectName = location.pathname.split('/')[2];
  const hierarchy = useSelector((state) => state.MDMSHierarchyProgress.data);

  // Error Handling
  const [errorMessage, setErrorMessage] = useState('');

  const [response, setResponse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getParams = () => {
    let params;
    if (startDateTimeAsPerFormat && endDateTimeAsPerFormat) {
      params = {
        project,
        site,
        page: currentPage,
        page_size: 10,
        data_state: selectDataPosition,
        start_date: startDateTimeAsPerFormat,
        end_date: endDateTimeAsPerFormat,
      };
    } else {
      params = {
        project,
        site,
        page: currentPage,
        page_size: 10,
        data_state: selectDataPosition,
      };
    }
    return params;
  };

  const [fetchBlockLoad, data] = useLazyGetMDMSGroupMeterBlockLoadDataQuery();

  useEffect(() => {
    fetchBlockLoad(getParams(), { preferCacheValue: true });
  }, []);

  useEffect(() => {
    if (data.status === 'fulfilled') {
      let statusCode = data.currentData.responseCode;
      if (statusCode === 200) {
        setResponse(data.currentData.data.result);
      }
    } else if (data.isError) {
      setErrorMessage('Something went wrong, please retry');
    }
  }, [data]);

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
    setStartDateTime(time[0]);
    setStartDateTimeAsPerFormat(dateTimeFormat(time[0]));
  };

  const onEndTimeSelected = (time) => {
    setEndDateTime(time[0]);
    setEndDateTimeAsPerFormat(dateTimeFormat(time[0]));
  };

  const onDataPositionSelected = (position) => {
    setSelectDataPosition(position['value']);
  };

  const refresh = () => {
    fetchBlockLoad(getParams());
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
        fetchBlockLoad(getParams());
      }
      // toast('Please enter meter serial.' type='danger' />, { hideProgressBar: true })
    } else {
      // Both the time are not set look for only data position value
      // toast.error(<Toast msg='Please enter meter serial.' type='danger' />, { hideProgressBar: true })
      fetchBlockLoad(getParams());
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
            {currentPage + i}
          </div>
        );
      },
    });
    return column;
  };

  const showData = () => {
    if (Object.keys(response).length > 0) {
      return Object.keys(response).map((key, index) => {
        response[key].map((item) => {
          const timeDifferenceInSeconds = moment(item.reporting_timestamp).diff(
            item.blockload_datetime,
            'seconds'
          );
          const hours = Math.floor(timeDifferenceInSeconds / 3600);
          const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
          const seconds = timeDifferenceInSeconds % 60;

          // item.response_time = `${
          //   hours ? hours.toString().concat(hours === 1 ? ' hr' : ' hrs') : ''
          // } ${minutes ? minutes.toString().concat(' min') : ''} ${seconds
          //   .toString()
          //   .concat(' sec')}`;
          return item;
        });

        return (
          <div className="table-wrapper" key={index}>
            <DataTableV1
              columns={tblColumn(response[key])}
              data={response[key]}
              rowCount={8}
              tableName={'Block Load Data'}
              currentPage={currentPage}
              showRefreshButton={true}
              refreshFn={refresh}
            />
          </div>
        );
      });
    } else {
      return (
        <div className="table-wrapper">
          <DataTableV1
            data={[]}
            rowCount={8}
            tableName={'Daily Load Data'}
            currentPage={currentPage}
            showRefreshButton={true}
            refreshFn={refresh}
          />
        </div>
      );
    }
  };

  const retryAgain = () => {
    fetchBlockLoad(getParams());
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
                  style={{
                    marginTop: '25px',
                  }}
                  className="btn w-100"
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

export default BlockLoadDataModal;
