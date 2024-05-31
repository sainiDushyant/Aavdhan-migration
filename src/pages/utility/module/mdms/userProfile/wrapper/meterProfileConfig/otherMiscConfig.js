import { Button, InputGroup, Input, Row, Col, Spinner } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useExecuteDlmsCommandMutation } from '../../../../../../../api/hes/command-historySlice';

import { useLocation } from 'react-router-dom';

const OtherMiscConfig = () => {
  const location = useLocation();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const [executeDlmsCommand, response] = useExecuteDlmsCommandMutation();
  const [dateTime, setDateTime] = useState(undefined);
  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const onDateRangeSelected = (date) => {
    setDateTime(moment(date[0]).format('YYYY-MM-DD HH:mm:ss'));
  };

  const handleButtonClick = () => {
    const payload = [
      {
        name: 'meter',
        meter_serial: HierarchyProgress.meter_serial_number,
        command: 'US_SET_RTC',
        args: {
          value: dateTime ? dateTime : 'now',
          input_type: 'date',
          mode: '',
        },
        value: {
          pss_id: HierarchyProgress.pss_name,
          feeder_id: HierarchyProgress.feeder_name,
          site_id: HierarchyProgress.dtr_name,
          meter_serial: HierarchyProgress.meter_serial_number,
          // protocol: 'dlms',
          // protocol_type: 'dlms'
          protocol: HierarchyProgress.meter_protocol_type,
          protocol_type: HierarchyProgress.meter_protocol_type,
          project: project,
        },
      },
    ];
    executeDlmsCommand({ data: payload });
  };

  useEffect(() => {
    if (response.status === 'fulfilled') {
      let statusCode = response.data.responseCode;
      if (statusCode === 201) {
        toast('Command sent to meter successfully.', {
          hideProgressBar: true,
          type: 'success',
        });
      } else if (response.isError) {
        toast('Command sent to meter failed.', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    }
  }, [response]);

  return (
    <Row>
      <Col md="5">
        <span className="text-danger font-weight-bold">Synchronize clock</span>
        <InputGroup className="mt_7">
          <Flatpickr
            placeholder="Select date ..."
            onChange={onDateRangeSelected}
            className="form-control"
            options={{ enableTime: true, static: true }}
          />
          <Button color="primary" outline onClick={handleButtonClick}>
            {response.isLoading ? <Spinner size="sm" /> : 'Sync'}
          </Button>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default OtherMiscConfig;
