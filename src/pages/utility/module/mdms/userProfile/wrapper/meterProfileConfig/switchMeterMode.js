import { Button, InputGroup, Row, Col } from 'reactstrap';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useLocation } from 'react-router-dom';
import { updateMDMSHierarchyProgress } from '../../../../../../../app/redux/mdmsHeirarchySlice';
import { useLazyUpdateMeterModeQuery } from '../../../../../../../api/mdms/userConsumptionSlice';
import { useExecuteDlmsCommandMutation } from '../../../../../../../api/hes/command-historySlice';

const SwitchMeterMode = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const [executeDlmsCommand, dlmsResponse] = useExecuteDlmsCommandMutation();
  const [updateMeterMode, meterModeResponse] = useLazyUpdateMeterModeQuery();

  const clearAllEssentialData = () => {
    props.updateMdmsState('user');

    dispatch(
      updateMDMSHierarchyProgress({
        ...HierarchyProgress,
        user_name: '',
        user_type: '',
        mdms_state: 'user',
      })
    );
  };

  const handleButtonClick = () => {
    const params = {};
    if (props.consumerType === 'POSTPAID') {
      params['connection_type'] = 'PREPAID';
    } else {
      params['connection_type'] = 'POSTPAID';
    }
    params['sc_no'] = HierarchyProgress.user_name;

    updateMeterMode(params);
  };

  useEffect(() => {
    if (meterModeResponse.status === 'fulfilled') {
      if (meterModeResponse.data.responseCode === 200) {
        let meter_mode = 0;
        if (props.consumerType === 'POSTPAID') {
          meter_mode = 1;
        } else {
          meter_mode = 0;
        }

        const commandParams = {
          data: [
            {
              name: 'meter',
              meter_serial: HierarchyProgress.meter_serial_number,
              value: {
                pss_name: '',
                pss_id: HierarchyProgress.pss_name,
                feeder_id: HierarchyProgress.feeder_name,
                feeder_name: '',
                site_id: HierarchyProgress.dtr_name,
                // protocol: 'DLMS',
                // protocol_type: 'DLMS',
                protocol: HierarchyProgress.meter_protocol_type,
                protocol_type: HierarchyProgress.meter_protocol_type,
                meter_serial: HierarchyProgress.meter_serial_number,
                meter_address: '',
                sc_no: HierarchyProgress.user_name,
                project: project,
                grid_id: '',
                site_name: '',
                meter_sw_version: 'NA',
              },
              command: 'US_SET_PAYMENT_MODE',
              args: {
                value: meter_mode,
                input_type: 'number',
                mode: '',
              },
            },
          ],
        };

        executeDlmsCommand(commandParams);
      }
    } else if (meterModeResponse.isError) {
      toast('Something went wrong, please try again.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  }, [meterModeResponse]);

  useEffect(() => {
    if (dlmsResponse.status === 'fulfilled') {
      let statusCode = dlmsResponse.data.responseCode;
      if (statusCode === 201) {
        toast('Meter mode successfully switched', {
          hideProgressBar: true,
          type: 'success',
        });
        clearAllEssentialData();
        props.setIsOpen(!props.isOpen);
      }
    } else if (dlmsResponse.isError) {
      toast('Something went wrong, please try again.');
    }
  }, [dlmsResponse]);

  let user_type = '';
  if (props.consumerType === 'POSTPAID') {
    user_type = 'Switch to prepaid mode';
  } else {
    user_type = 'Switch to postpaid mode';
  }

  return (
    <Row>
      <Col md="5">
        {/* <span className='text-danger font-weight-bold'>Synchronize clock</span> */}
        <InputGroup className="mt_7">
          <Button color="primary" outline onClick={handleButtonClick}>
            {user_type}
          </Button>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default SwitchMeterMode;
