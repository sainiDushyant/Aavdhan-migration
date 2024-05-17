import { Col, Button, Row, Input } from 'reactstrap';
import Select from 'react-select';

import moment from 'moment';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
// import { useSelector } from 'react-redux'

import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCommandInfoAssetsQuery,
  useLazyGISMetersListQuery,
} from '../../../../../../api/drop-downSlice';

const CommonMeterDropdown = (props) => {
  const location = useLocation();

  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const verticalName = location.pathname.split('/')[1];
  // Logout User
  const [logout, setLogout] = useState(false);
  // useEffect(() => {
  //   if (logout) {
  //     authLogout(history, dispatch);
  //   }
  // }, [logout]);

  // const responseData = useSelector(state => state.UtilityMdmsFlowReducer)
  const {
    data: commandInfoAssetsResponse,
    isFetching: commandInfoAssetsLoading,
  } = useCommandInfoAssetsQuery({
    project: projectName,
    vertical: verticalName,
  });

  const [dtr, setDtr] = useState([]);

  const [meter, setMeter] = useState(undefined);
  const [meterSearch, setMeterSearch] = useState(undefined);
  const [params, setParams] = useState({});
  const [showDTRDropDown, setShowDTRDropDown] = useState(true);
  const [meterList, setMeterList] = useState(undefined);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [selectedDTR, setSelectedDTR] = useState();

  const [inputType, setInputType] = useState();

  // Set default Start date to the current date and time
  const defaultBillingStartDate = moment()
    .startOf('month')
    .format('YYYY-MM-DD 00:00:00');
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD 00:00:00'); // Yesterday, start of day
  // Set default end date to the current date and time
  const defaultEndDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [startDateTime, setStartDateTime] = useState(
    props.billingData ? defaultBillingStartDate : defaultStartDate
  );
  const [endDateTime, setEndDateTime] = useState(defaultEndDate);

  const [disableDTRDropdown, setDisableDTRDropdown] = useState(false);
  const [disableMeterDropDown, setDisableMeterDropDown] = useState(false);
  const [disableMeterSearch, setDisableMeterSearch] = useState(false);

  const [fetchGisMeters, data] = useLazyGISMetersListQuery(params);

  useEffect(() => {
    const statusCode = commandInfoAssetsResponse?.responseCode;
    const pss_list = [];
    const feeder_list = [];
    const dtr_list = [];
    if (statusCode) {
      if (statusCode === 200) {
        const data = commandInfoAssetsResponse?.data?.result?.stat;
        for (const pss of data['pss_list']) {
          const temp = {};
          temp['pss_name'] = pss['pss_name'];
          temp['pss_id'] = pss['pss_id'];

          pss_list.push(temp);
        }

        // Create Feeder list
        for (const feeder of data['feeder_list']) {
          const temp = {};
          const parent_pss = feeder['pss_id'];
          for (const pss of pss_list) {
            if (pss['pss_id'] === parent_pss) {
              temp['feeder_name'] = feeder['feeder_name'];
              temp['feeder_id'] = feeder['feeder_id'];
              temp['pss_name'] = pss['pss_name'];
              temp['pss_id'] = pss['pss_id'];
              feeder_list.push(temp);
            }
          }
        }

        // Create DTR List
        for (const dtr of data['live_dt_list']) {
          const temp = {};
          const parent_feeder = dtr['feeder_id'];
          for (const feeder of feeder_list) {
            if (feeder['feeder_id'] === parent_feeder) {
              temp['feeder_name'] = feeder['feeder_name'];
              temp['feeder_id'] = feeder['feeder_id'];
              temp['pss_name'] = feeder['pss_name'];
              temp['pss_id'] = feeder['pss_id'];
              temp['dtr_name'] = dtr['site_name'];
              temp['dtr_id'] = dtr['site_id'];
              dtr_list.push(temp);
            }
          }
        }
        const temp_dtr = [];
        if (dtr_list.length > 0) {
          for (const ele of dtr_list) {
            const temp = {};
            temp['value'] = ele['dtr_id'];
            temp['label'] = ele['dtr_name'];
            temp['pss_id'] = ele['pss_id'];
            temp['feeder_id'] = ele['feeder_id'];
            temp['isFixed'] = 'true';
            temp_dtr.push(temp);
          }
          setDtr(temp_dtr);
        }
      } else if (statusCode === 401 || statusCode === 403) {
        setLogout(true);
      }
    }
  }, [commandInfoAssetsResponse]);

  useEffect(() => {
    if (selectedDTR) {
      const params = {
        project:
          location.pathname.split('/')[2] === 'sbpdcl'
            ? 'ipcl'
            : location.pathname.split('/')[2],
        site_id: selectedDTR?.['value'],
      };
      setParams(params);
      fetchGisMeters(params);
    } else {
      setMeter(undefined);
      setMeterList(undefined);
    }
  }, [selectedDTR]);

  useEffect(() => {
    const statusCode = data?.currentData?.responseCode;

    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        setLogout(true);
      } else {
        // Construct Meter List for DropDown
        const temp_meter_list = data?.currentData?.data.result.stat.meters;

        const meter_list = [];
        for (let i = 0; i < temp_meter_list.length; i++) {
          const temp_meter = {};
          temp_meter['value'] = temp_meter_list[i]['meter_number'];
          temp_meter['label'] = temp_meter_list[i]['meter_number'];
          temp_meter['isFixed'] = 'true';
          meter_list.push(temp_meter);
        }

        setMeterList(meter_list);
      }
    }
  }, [data]);

  const onDtrSelected = (selectedOption) => {
    if (selectedOption) {
      setSelectedDTR(selectedOption);
      setSelectedMeter(null);
      setDisableMeterSearch(true);
    } else {
      setSelectedDTR([]);
      setSelectedMeter(null);
      setMeter(undefined);
      setMeterList(undefined);
      setDisableMeterSearch(false);
    }
  };

  const onMeterSelected = (selectedOption) => {
    if (selectedOption) {
      setMeter(selectedOption['value']);
      setInputType(null);
      setParams({});
      setSelectedMeter(selectedOption);
      // setStartDateTime(undefined)
      // setEndDateTime(undefined)
    } else {
      setMeter(undefined);

      setInputType(null);
      setParams({});
      setSelectedMeter(null);
    }
  };

  const handleMeterSearchChange = (event) => {
    if (event.target.value) {
      // console.log('text available ....')
      setMeterSearch(event.target.value);
      // Disable Meter and DTR Dropdown
      if (!disableMeterDropDown) {
        setDisableDTRDropdown(true);
        setDisableMeterDropDown(true);
      }
    } else {
      setMeterSearch(undefined);
      setDisableDTRDropdown(false);
      setDisableMeterDropDown(false);

      // console.log('No Text Available .....')
    }
  };

  const onDateRangeSelected = (dateRange) => {
    const currentDate = new Date(); // Get the current date and time
    const startDateTime = moment(dateRange[0]);
    const endDateTime = moment(dateRange[1]);
    if (dateRange && dateRange.length === 2) {
      // Check if either the startDateTime or endDateTime is in the future
      if (
        startDateTime.isAfter(currentDate) ||
        endDateTime.isAfter(currentDate)
      ) {
        setStartDateTime(defaultStartDate);
        setEndDateTime(defaultEndDate);
      }
      const differenceInDays = endDateTime.diff(startDateTime, 'days');
      if (differenceInDays <= 30) {
        setStartDateTime(startDateTime.format('YYYY-MM-DD HH:mm:ss'));
        setEndDateTime(endDateTime.format('YYYY-MM-DD HH:mm:ss'));
      } else {
        // setStartDateTime(defaultDateTime.startDateTime);
        // setEndDateTime(defaultDateTime.endDateTime);
        // toast.error(
        //   <Toast
        //     msg={'Date range cannot be more than 30 days'}
        //     type="danger"
        //   />,
        //   {
        //     hideProgressBar: true,
        //   }
        // );
      }
    }
  };

  const Submitresponse = () => {
    // console.log('On Submit Button clicked...')
    const params = {};

    if (selectedDTR) {
      params['site'] = selectedDTR?.value;
    } else {
      // If No Site Selected, add all sites access available
      const dtr_list = '';
      // for (let i = 0; i < responseData.responseData.dtr_list.length; i++) {
      //   dtr_list += `${responseData.responseData.dtr_list[i]['id']},`
      // }
      params['site'] = dtr_list;
    }

    if (meter) {
      params['meter'] = meter;
    }
    if (meterSearch) {
      params['meter'] = meterSearch;
    }

    if (!props.hideDateRangeSelector) {
      if (startDateTime && !endDateTime) {
        // console.log(startDateTime)
        // // console.log(endDateTime)
        // toast.error(<Toast msg="Please select End Date Time" type="danger" />, {
        //   hideProgressBar: true,
        // });
        return;
      } else if (startDateTime && endDateTime) {
        params['start_date'] = startDateTime;
        params['end_date'] = endDateTime;
      }
    }

    props.onSubmitButtonClicked(params);
  };

  return (
    <>
      <Row>
        {showDTRDropDown && (
          <Col lg="3" sm="6" className="mb-1">
            <Select
              isClearable={true}
              onChange={onDtrSelected}
              isSearchable
              options={dtr}
              value={selectedDTR}
              isDisabled={disableDTRDropdown}
              className="react-select rounded zindex_1003"
              classNamePrefix="select"
              placeholder={
                commandInfoAssetsLoading ? 'Loading...' : 'Select site ...'
              }
            />
          </Col>
        )}

        {!props.hideMeterSelector && (
          <Col lg="3" sm="6" className="mb-1">
            <Select
              isClearable={true}
              onChange={onMeterSelected}
              options={meterList}
              maxMenuHeight={200}
              value={selectedMeter}
              isDisabled={disableMeterDropDown}
              isSearchable
              className="react-select zindex_1002"
              classNamePrefix="select"
              placeholder={data.isFetching ? 'Loading...' : 'Select meter ...'}
            />
          </Col>
        )}

        {!props.hideMeterSearch && (
          <Col lg="3" sm="6" className="mb-1">
            <Input
              type="number"
              onChange={handleMeterSearchChange}
              disabled={disableMeterSearch}
              placeholder="Search for meter number"
            />
          </Col>
        )}

        {!props.hideDateRangeSelector && (
          <Col lg="3" sm="6" className="mb-1">
            <Flatpickr
              placeholder="Select date ..."
              onChange={onDateRangeSelected}
              className="form-control"
              value={[startDateTime, endDateTime]}
              options={{ mode: 'range', enableTime: true, time_24hr: true }}
            />
          </Col>
        )}

        <Col lg="2" sm="5">
          <Button
            color="primary"
            className="btn-block "
            onClick={Submitresponse}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default CommonMeterDropdown;
