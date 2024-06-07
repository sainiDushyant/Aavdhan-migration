import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import moment from 'moment';

const SlaFilter = (props) => {
  const { filterParams } = props;
  const defaultStartDate = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD'); // Yesterday, start of day
  const defaultEndDate = moment().startOf('day').format('YYYY-MM-DD'); // Today, start of day

  const [startDateTimeSelected, setStartDateTimeSelected] =
    useState(defaultStartDate);
  const [endDateTimeSelected, setEndDateTimeSelected] =
    useState(defaultEndDate);

  const [isStartendDateSelected, setIsStartendDateSelected] = useState(true);

  const onDateRangeSelected = (selectedDates) => {
    const [startDate, endDate] = selectedDates;
    if (selectedDates && selectedDates.length === 2) {
      setStartDateTimeSelected(moment(startDate).format('YYYY-MM-DD'));
      setEndDateTimeSelected(moment(endDate).format('YYYY-MM-DD'));
      setIsStartendDateSelected(true);
    } else {
      setStartDateTimeSelected(moment(startDate).format('YYYY-MM-DD'));
      setEndDateTimeSelected(undefined);
      if (endDate === undefined) {
        setIsStartendDateSelected(false);
      } else {
        setIsStartendDateSelected(true);
      }
    }
  };

  const onSubmitButtonClicked = () => {
    if (!isStartendDateSelected) {
      // Show toast warning for selecting end date
      toast('Please select End Date .', {
        hideProgressBar: true,
        type: 'danger',
      });
      return false; // Prevent further execution
    }
    const params = {};
    params['startDate'] = startDateTimeSelected;
    params['endDate'] = endDateTimeSelected;
    filterParams(params);
  };

  return (
    <Row className="mb-2">
      <Col lg="3" md="3" className="mb-2">
        <Flatpickr
          placeholder="Select date ..."
          onChange={onDateRangeSelected}
          className="form-control"
          value={[startDateTimeSelected, endDateTimeSelected]}
          options={{
            mode: 'range',
            dateFormat: 'Y-m-d',
            allowInput: false,
          }}
        />
      </Col>
      <Col lg="1" sm="3" md="3" className="">
        <Button
          color="primary"
          className="btn "
          onClick={onSubmitButtonClicked}
        >
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default SlaFilter;
