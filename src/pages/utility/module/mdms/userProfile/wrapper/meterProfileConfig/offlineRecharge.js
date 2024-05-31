import { Button, InputGroup, Input } from 'reactstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';

import { useExecuteDlmsCommandMutation } from '../../../../../../../api/hes/command-historySlice';
import { usePutOfflineRechargeMutation } from '../../../../../../../api/mdms/userConsumptionSlice';

import { useLocation } from 'react-router-dom';

const OfflineRecharge = (props) => {
  const location = useLocation();
  const project =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];

  const [rechargeValue, setRechargeValue] = useState(0);
  const [rechargeMeter, setRechargeMeter] = useState(false);

  const [TurnRelayOnCommand, setTurnRelayOnCommand] = useState(false);

  const HierarchyProgress = useSelector(
    (state) => state.MDMSHierarchyProgress.data
  );

  const [executeDlmsCommand] = useExecuteDlmsCommandMutation();
  const [offlineRecharge] = usePutOfflineRechargeMutation();

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

  // const executeOfflineRechargeCommand = async (params) => {
  //   return await useJwt
  //     .postMdasDlmsCommandExecution(params)
  //     .then((res) => {
  //       const status = res.status
  //       return [status, res]
  //     })
  //     .catch((err) => {
  //       const status = 0
  //       return [status, err]
  //     })
  // }

  // const offlineMeterRecharge = async (params) => {
  //   return await useJwt
  //     .putOfflineRecharge(params)
  //     .then((res) => {
  //       const status = res.status
  //       return [status, res]
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         const status = err.response.status
  //         return [status, err]
  //       } else {
  //         return [0, err]
  //       }
  //     })
  // }

  // const postCommandExecutionRequest = async (jsonBody) => {
  //   return await useJwt
  //     .postMdasDlmsCommandExecution(jsonBody)
  //     .then((res) => {
  //       const status = res.status
  //       return [status, res]
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         const status = err.response.status
  //         return [status, err]
  //       } else {
  //         return [0, err]
  //       }
  //     })
  // }

  const command_params_request_body = (
    command_name,
    command_value,
    command_input_type,
    command_mode
  ) => {
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
            // protocol: "DLMS",
            // protocol_type: "DLMS",
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
          command: command_name,
          args: {
            value: command_value,
            input_type: command_input_type,
            mode: command_mode,
          },
        },
      ],
    };

    return commandParams;
  };

  useEffect(() => {
    async function func() {
      if (rechargeMeter) {
        const d = new Date();
        const ms = d.getMilliseconds();

        const params = {
          project: project,
          sc_no: HierarchyProgress.user_name,
          recharge_amount: rechargeValue,
          receipt_number: ms,
        };
        try {
          const [response] = await offlineRecharge(params);
          const offlineRechargeResponse = response;

          if (offlineRechargeResponse.data.responseCode === 200) {
            // 1.Store Update Wallet Balance
            const updated_wallet_balance =
              offlineRechargeResponse.data.data.result.wallet_balance;

            // 2.Execute command on meter to recharge
            const request_body_1 = command_params_request_body(
              'US_SET_LAST_TOKEN_RECHARGE_AMOUNT',
              rechargeValue,
              'number',
              ''
            );
            // console.log("Request Body")
            // console.log(request_body_1)

            const [dlmsResponse1] = await executeDlmsCommand(request_body_1);

            if (dlmsResponse1.data.responseCode === 201) {
              // 3.Execute command on meter to set current timestamp
              const x = new Date();
              const current_time_stamp = dateTimeFormat(x);
              const request_body_2 = command_params_request_body(
                'US_SET_LAST_TOKEN_RECHARGE_TIME',
                current_time_stamp,
                'date',
                ''
              );
              const [dlmsResponse2] = await executeDlmsCommand(request_body_2);

              if (dlmsResponse2.data.responseCode === 201) {
                // 4.Execute command on meter to set aggregate value of recharge on meter
                const request_body_3 = command_params_request_body(
                  'US_SET_LAST_RECHARGE_TOTAL_AMOUNT',
                  updated_wallet_balance,
                  'number',
                  ''
                );
                const [dlmsResponse3] = await executeDlmsCommand(
                  request_body_3
                );

                if (dlmsResponse3.data.responseCode === 201) {
                  if (
                    offlineRechargeResponse.data.data.result.relay_on_flag === 1
                  ) {
                    setRechargeMeter(false);
                    setTurnRelayOnCommand(true);
                    toast('Meter successfully recharged', {
                      hideProgressBar: true,
                      type: 'success',
                    });
                  } else {
                    setRechargeMeter(false);
                    toast('Meter successfully recharged', {
                      hideProgressBar: true,
                      type: 'success',
                    });
                    props.setIsOpen(!props.isOpen);
                  }
                } else {
                  // Something went wrong
                  toast('Something went wrong please retry', {
                    hideProgressBar: true,
                    type: 'error',
                  });
                }
              }
            }
          }
        } catch (err) {
          toast('Something went wrong, please retry.', {
            hideProgressBar: true,
            type: 'error',
          });
        }
      }
    }
    func();
  }, [rechargeMeter]);

  useEffect(() => {
    async function func() {
      if (TurnRelayOnCommand) {
        const payload = [
          {
            name: 'meter',
            meter_serial: HierarchyProgress.meter_serial_number,
            command: 'US_RELAY_ON',
            args: {
              value: '',
              input_type: '',
              mode: '',
            },
            value: {
              pss_id: HierarchyProgress.pss_name,
              feeder_id: HierarchyProgress.feeder_name,
              site_id: HierarchyProgress.dtr_name,
              meter_serial: HierarchyProgress.meter_serial_number,
              // protocol: "dlms",
              protocol: HierarchyProgress.meter_protocol_type,
              protocol_type: HierarchyProgress.meter_protocol_type,
              project: project,
              // protocol_type: "dlms"
            },
          },
        ];

        const [response] = await executeDlmsCommand({ data: payload });
        if (response.data.responseCode === 201) {
          toast('Command sent to meter successfully.', {
            hideProgressBar: true,
            type: 'success',
          });
          props.setIsOpen(!props.isOpen);
        } else {
          if (typeof response.data === 'string') {
            toast(response, { hideProgressBar: true, type: 'error' });
          } else {
            toast('Command sent to meter failed.', {
              hideProgressBar: true,
              type: 'error',
            });
          }
        }
      }
    }
    func();
  }, [TurnRelayOnCommand]);

  const isInt = (n) => {
    return n % 1 === 0;
  };

  const handleButtonClick = () => {
    // console.log('Recharge Value Entered ...')
    // console.log(rechargeValue)
    // setRechargeMeter(true)
    if (isInt(rechargeValue)) {
      // if (rechargeValue <= 0 || rechargeValue > 10000) {
      //   toast.error(<Toast msg='Recharge Amount should be greater than 0 and less than 10000' type='danger' />, { hideProgressBar: true })
      // } else {
      //   setRechargeValue(parseInt(rechargeValue))
      //   setRechargeMeter(true)
      // }
      setRechargeValue(parseInt(rechargeValue));
      setRechargeMeter(true);
    } else {
      toast.error('Please enter integer value .', {
        hideProgressBar: true,
        type: 'warning',
      });
    }
  };

  return (
    <InputGroup>
      <Input
        type="number"
        placeholder="Recharge Amount(₹)"
        onChange={(e) => setRechargeValue(e.target.value)}
      />
      <Button color="primary" outline onClick={handleButtonClick}>
        Recharge
      </Button>
    </InputGroup>
  );
};

export default OfflineRecharge;
