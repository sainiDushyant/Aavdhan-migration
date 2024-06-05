import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Label, FormGroup, Spinner } from 'reactstrap';

import { selectThemeColors } from '../../../../utils';
import Select from 'react-select';

import Flatpickr from 'react-flatpickr';

import Nouislider from 'nouislider-react';

import { toast } from 'react-toastify';

import moment from 'moment';

import { useLocation } from 'react-router-dom';
import { useCommandInfoDLMSQuery } from '../../../../api/hes/drop-downSlice';
import { useExecuteDlmsCommandMutation } from '../../../../api/hes/command-historySlice';
import { useUpdateExecutionIdsMutation } from '../../../../api/sat';
import { useGetTestsByIdQuery } from '../../../../api/sat';

const CommandExecutionSat = (props) => {
  const location = useLocation();
  const [executeDlmsCommand, dlmsCommandExecuteReponse] =
    useExecuteDlmsCommandMutation();
  const [updateExecutionIds, executionIdsResponse] =
    useUpdateExecutionIdsMutation();
  // Logout User

  const [rowData, setRowData] = useState({ ...props.rowData });

  const [params, setParams] = useState({});
  const [extraParams, setExtraParams] = useState({});
  const [selectedCommand, setSelectedCommand] = useState(null);

  const [inputType, setInputType] = useState();
  const [datePicker, setDatePicker] = useState();
  const [valuePicker, setValuePicker] = useState('');
  const [toValue, setToValue] = useState();
  const [toTime, setToTime] = useState();
  const [rangePicker, setRangePicker] = useState([0, 0]);
  const [activeCal1, setActiveCal1] = useState();
  const [activeCal2, setActiveCal2] = useState();
  const [activeCal3, setActiveCal3] = useState();
  const [activeCal4, setActiveCal4] = useState();
  const [activeCal5, setActiveCal5] = useState();
  const [activeCal6, setActiveCal6] = useState();
  const [activeCal7, setActiveCal7] = useState();
  const [activeCal8, setActiveCal8] = useState();
  const [selectiveAccess, setSelectiveAccess] = useState();
  const [isSelect, setIsSelect] = useState(true);
  const [selectedESW, setSelectedESW] = useState();

  const [selectedmeterList, setSelectedMeterList] = useState(props.meterList);

  // Local State to maintain Selected Protocol

  // Local State to maintain Selected Protocol Command List
  const [dlmsCommandList, setDlmsCommandList] = useState([]);
  const [tapCommandList, setTapCommandList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cmdSendCount, setCmdSendCount] = useState(0);

  const [retryCount, setRetryCount] = useState(null);

  let [val, mod, inpt] = ['', '', ''];

  const {
    isFetching,
    data: testsById,
    isError,
    status,
    refetch,
  } = useGetTestsByIdQuery({ id: rowData.id });

  useEffect(() => {
    if (status === 'fulfilled') {
      const mappedData = testsById.sampleMeters?.map((meter) => {
        if (meter && meter.hasOwnProperty('meterSerial')) {
          return {
            value: meter.meterSerial,
            label: meter.meterSerial,
          };
        }
      });
      setSelectedMeterList(mappedData);
      setRowData({ ...rowData, sampleMeters: testsById.sampleMeters });
    } else if (isError) {
      toast(
        <>
          Error fetching sample meters...
          <Button
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: '#7367f0',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={refetch}
          >
            Retry
          </Button>
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: false,
        }
      );
    }
  }, [testsById, isError, status]);

  const dlmsParams = {
    project:
      location.pathname.split('/')[2] === 'sbpdcl'
        ? 'ipcl'
        : location.pathname.split('/')[2],
    vertical: location.pathname.split('/')[1],
  };

  const {
    data: dlmsResponse,
    isFetching: dlmsFetching,
    isError: dlmsError,
    status: dlmsStatus,
    refetch: fetchDlmsCommandList,
  } = useCommandInfoDLMSQuery(dlmsParams);

  useEffect(() => {
    if (dlmsStatus === 'fulfilled') {
      const dlmsCommandList = dlmsResponse.data.result;

      setDlmsCommandList(dlmsCommandList);
    } else if (dlmsError) {
      toast(
        <>
          Error Loading command list...
          <Button
            style={{
              width: '100px',
              height: '30px',
              backgroundColor: '#7367f0',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={fetchDlmsCommandList}
          >
            Retry
          </Button>
        </>,
        {
          hideProgressBar: true,
          type: 'error',
          closeOnClick: true,
          autoClose: false,
        }
      );
    }
  }, [dlmsError, dlmsStatus, dlmsResponse]);

  useEffect(() => {
    if (dlmsCommandExecuteReponse.status === 'fulfilled') {
      let executionIds;

      executionIds = {
        ...executionIds,
        ...dlmsCommandExecuteReponse.data.data.result,
      };
      function chunkObject(obj, chunkSize) {
        const entries = Object.entries(obj);
        const result = [];
        for (let i = 0; i < entries.length; i += chunkSize) {
          result.push(Object.fromEntries(entries.slice(i, i + chunkSize)));
        }
        return result;
      }

      const executionIdChunks = chunkObject(executionIds, 500);

      for (const executionIdChunk of executionIdChunks) {
        updateExecutionIds({
          id: rowData.id,
          cmdName: selectedCommand.value,
          cmdArgs: {
            value: val,
            input_type: inpt,
            mode: mod,
          },
          executionIds: executionIdChunk,
        });
      }

      toast('Command sent successfully', {
        hideProgressBar: true,
        type: 'success',
      });
      props.setCommandExecutionModal(false);
    }
    if (dlmsCommandExecuteReponse.isError) {
      toast('Something went wrong.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  }, [dlmsCommandExecuteReponse]);

  useEffect(() => {
    if (executionIdsResponse.isError) {
      toast('Failed to execute command, please retry.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  }, [executionIdsResponse]);

  const resetDefault = () => {
    setDatePicker();
    setRangePicker([0, 0]);
    setValuePicker('');
    setToValue();
    setToTime();
    setActiveCal1();
    setActiveCal2();
    setActiveCal3();
    setActiveCal4();
    setActiveCal5();
    setActiveCal6();
    setActiveCal7();
    setActiveCal8();
    setSelectedESW();
    setSelectiveAccess(false);
  };

  // on click function of apply button to submit command
  const submitCommmandRequest = () => {
    if (!selectedCommand) {
      toast('Please select command.', {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    } else if (!(retryCount >= 0 && retryCount <= 10)) {
      toast('Retry count must be between 0 to 10', {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    } else if (inputType) {
      if (inputType.includes('date') || inputType.includes('time')) {
        if (inputType === 'timeRange' || inputType === 'dateTimeRange') {
          if (selectedCommand['command_type'] === 'MR') {
            if ((!datePicker && toTime) || (datePicker && !toTime)) {
              toast('Please select Time range.', {
                hideProgressBar: true,
                type: 'warning',
              });
              return false;
            }
            const currentDate = new Date();
            const selectedDate = new Date(datePicker); // Assuming datePicker contains the selected date
            const selectedTime = new Date(toTime);

            // Check if the selected date is the current date and the selected time is greater than the current time
            if (selectedDate.toDateString() !== currentDate.toDateString()) {
              // Check if the selected time is greater than 00:00 (midnight)
              const midnight = new Date(currentDate);
              midnight.setHours(0, 0, 0, 0); // Set time to 00:00:00:000

              if (selectedTime > midnight) {
                toast('Time must be 00:00 for current date', {
                  hideProgressBar: true,
                  type: 'warning',
                });
                return false;
              }
            }
          } else {
            if (!datePicker || !toTime) {
              toast('Please select Time range.', {
                type: 'warning',
                hideProgressBar: true,
              });
              return false;
            }
          }
        }
        if (!datePicker) {
          toast('Please select Date.', {
            hideProgressBar: true,
            type: 'warning',
          });
          return false;
        }
      } else if (
        inputType === 'range' &&
        !rangePicker &&
        selectedCommand['command_type'] !== 'MR'
      ) {
        toast('Please select input range.', {
          hideProgressBar: true,
          type: 'warning',
        });
        return false;
      } else if (
        (inputType === 'text' || inputType === 'number') &&
        !valuePicker &&
        valuePicker < 0
      ) {
        toast('Please insert input value.', {
          hideProgressBar: true,
        });
        return false;
      } else if (inputType === 'numberRange' && (!valuePicker || !toValue)) {
        toast('Please insert number range.', {
          hideProgressBar: true,
        });
        return false;
      } else if (
        (inputType === 'activityCal1ph' || inputType === 'activityCal3ph') &&
        (!activeCal1 || !activeCal2)
      ) {
        toast('First and second tod must be selected.', {
          hideProgressBar: true,
          type: 'warning',
        });
        return false;
      } else if (
        (inputType === 'select_text' || inputType === 'select_number') &&
        !selectedESW
      ) {
        toast(
          'Please select at lease one the ESW filter.',

          {
            hideProgressBar: true,
            type: 'warning',
          }
        );
        return false;
      }
    }

    const [selectedMetersList, commandName] = [[], selectedCommand.value];

    // Value according to POST payload
    if (inputType) {
      if (inputType.includes('date') || inputType.includes('time')) {
        if (inputType === 'timeRange') {
          const [from, to] = [
            moment(datePicker[0]).format('HH:mm:ss'),
            moment(toTime[0]).format('HH:mm:ss'),
          ];
          val = { from, to };
          mod = 'range';
          inpt = 'time';
        } else if (inputType === 'dateTimeRange') {
          if (selectedCommand['command_type'] === 'MR') {
            if (datePicker && toTime) {
              const [from, to] = [
                moment(datePicker[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(toTime[0]).format('YYYY-MM-DD HH:mm:ss'),
              ];
              val = { from, to };
              mod = 'range';
              inpt = 'date';
            }
          } else {
            const [from, to] = [
              moment(datePicker[0]).format('YYYY-MM-DD HH:mm:ss'),
              moment(toTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            ];
            val = { from, to };
            mod = 'range';
            inpt = 'date';
          }
        } else if (datePicker) {
          const [from, to] = [
            moment(datePicker[0]).format('YYYY-MM-DD HH:mm:ss'),
            moment(datePicker[1]).format('YYYY-MM-DD HH:mm:ss'),
          ];
          val = datePicker[1] ? { from, to } : from;
          mod = params.mode ? params.mode : '';
          inpt = 'date';
        }
      } else if (inputType === 'range') {
        if (selectedCommand['command_type'] === 'MR') {
          if (rangePicker) {
            val = {
              from: parseInt(rangePicker[0]),
              to: parseInt(rangePicker[1]),
            };
            mod = 'range';
            inpt = 'number';
          }
        } else if (rangePicker) {
          val = {
            from: parseInt(rangePicker[0]),
            to: parseInt(rangePicker[1]),
          };
          mod = 'range';
          inpt = 'number';
        }
      } else if (inputType === 'text' || inputType === 'number') {
        val = valuePicker;
        mod = params.mode ? params.mode : '';
        inpt = inputType;
      } else if (inputType === 'numberRange') {
        val = { from: parseInt(valuePicker), to: parseInt(toValue) };
        mod = 'range';
        inpt = 'number';
      } else if (inputType === 'activityCal1ph') {
        const [tod1, tod2, tod3, tod4] = [
          moment(activeCal1[0]).format('HH:mm:ss'),
          moment(activeCal2[0]).format('HH:mm:ss'),
          activeCal3 ? moment(activeCal3[0]).format('HH:mm:ss') : '-',
          activeCal4 ? moment(activeCal4[0]).format('HH:mm:ss') : '-',
        ];
        val = [tod1, tod2, tod3, tod4];
        mod = 'multi';
        inpt = 'date';
      } else if (inputType === 'activityCal3ph') {
        const [tod1, tod2, tod3, tod4, tod5, tod6, tod7, tod8] = [
          moment(activeCal1[0]).format('HH:mm:ss'),
          moment(activeCal2[0]).format('HH:mm:ss'),
          activeCal3 ? moment(activeCal3[0]).format('HH:mm:ss') : '-',
          activeCal4 ? moment(activeCal4[0]).format('HH:mm:ss') : '-',
          activeCal5 ? moment(activeCal5[0]).format('HH:mm:ss') : '-',
          activeCal6 ? moment(activeCal6[0]).format('HH:mm:ss') : '-',
          activeCal7 ? moment(activeCal7[0]).format('HH:mm:ss') : '-',
          activeCal8 ? moment(activeCal8[0]).format('HH:mm:ss') : '-',
        ];
        val = [tod1, tod2, tod3, tod4, tod5, tod6, tod7, tod8];
        mod = 'multi';
        inpt = 'date';
      } else if (inputType === 'select_text' || inputType === 'select_number') {
        if (params.isMulti) {
          const selectedVal = [];
          for (const i of selectedESW) {
            selectedVal.push(i.value);
          }
          val = selectedVal;
          mod = 'multi';
          inpt = inputType.split('_')[1];
        } else {
          val = selectedESW.value;
          mod = '';
          inpt = inputType.split('_')[1];
        }
      }
    }

    // Create the payload and payload forr post request

    for (const meter of rowData.sampleMeters) {
      let argsValue;
      if (commandName === 'EVENTS') {
        argsValue = {
          value: {
            from: 0,
            to: 50,
          },
          input_type: 'number',
          mode: 'range',
        };
      } else {
        // Use the original args value for other commands
        argsValue = {
          value: val,
          input_type: inpt,
          mode: mod,
        };
      }
      const meterValues = [];
      for (const item of selectedmeterList) {
        meterValues.push(item.value);
      }
      if (meterValues.includes(meter['meterSerial'])) {
        const mtr = {
          name: 'meter',
          meter_serial: meter['meterSerial'],
          value: {
            pss_id: meter['pssId'],
            pss_name: meter['pssName'],
            feeder_id: meter['feederId'],
            feeder_name: meter['feederName'],
            site_id: meter['siteId'],
            site_name: meter['siteName'],
            meter_address: meter['meterAddress'],
            grid_id: meter['gridId'],
            meter_sw_version: meter['meterSwVersion'],
            meter_serial: meter['meterSerial'],

            // protocol: selectedProtocol.value === "dlms" ? "dlms" : "tap",
            protocol: 'dlms',
            project:
              location.pathname.split('/')[2] === 'sbpdcl'
                ? 'ipcl'
                : location.pathname.split('/')[2],
            protocol_type: meter['meterProtocolType'],
            // protocol_type: selectedProtocol.value === "dlms" ? "dlms" : "tap"
          },
          command: commandName,
          args: argsValue,
        };

        if (retryCount !== null) {
          mtr.task_retry = retryCount;
        }

        if (props.rowData.id) {
          mtr.sat_test_id = props.rowData.id;
        }
        selectedMetersList.push(mtr);
      }
    }

    let response = {};

    function chunkArray(array, chunkSize) {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    }
    const chunks = chunkArray(selectedMetersList, 100);

    for (const chunk of chunks) {
      let newChunk = chunk;

      newChunk = chunk.filter((item) => {
        if (
          item.command === 'Turn Relay On' ||
          item.command === 'Turn Relay Off'
        ) {
          return item.siteId === 'S1_Rf_Empanelment_20230629_130115';
        }
      });
      executeDlmsCommand({ data: chunk });
    }

    setCmdSendCount(0);
  };

  useEffect(() => {
    resetDefault();
    if (selectedCommand) {
      if (
        selectedCommand['command_type'] === 'MR' &&
        selectedCommand.input_type
      ) {
        // Check if the from time and to time exist
        if (document.getElementById('timeFrom')) {
          const from = document.getElementById('timeFrom');
          const to = document.getElementById('timeTo');
          from._flatpickr.clear();
          to._flatpickr.clear();
        }
        setSelectiveAccess(true);
        if (isSelect) {
          setInputType(selectedCommand.input_type);
          setParams(selectedCommand.params);
        } else {
          setInputType(null);
          setParams({});
        }
      } else {
        setIsSelect(false);
        setSelectiveAccess(false);
        setInputType(selectedCommand.input_type);
        setParams(selectedCommand.params);
      }
    } else {
      setInputType(null);
      setParams({});
    }
  }, [selectedCommand, isSelect]);

  const timeChangeHandler = (value) => {
    // console.log('time values....')
    // console.log(value)
    setDatePicker(value);
    setExtraParams({
      minDate: value[0],
    });

    const to = document.getElementById('timeTo');
    to._flatpickr.clear();
  };

  const fromNumberChangeHandler = (event) => {
    try {
      if (inputType.includes('number')) {
        const { value, min, max } = event.target;
        const val = Math.max(Number(min), Math.min(Number(max), Number(value)));

        setValuePicker(val);
      } else {
        setValuePicker(event.target.value);
      }
    } catch (err) {}
  };

  const toNumberChangeHandler = (event) => {
    try {
      const { value, min, max } = event.target;
      const val = Math.max(Number(min), Math.min(Number(max), Number(value)));

      setToValue(val);
    } catch (err) {}
  };

  const onCommandSelection = (selectedOption) => {
    setSelectedCommand(selectedOption);
  };

  const onRetryCount = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRetryCount(Number(value));
  };

  return (
    <>
      {/* <FormGroup row>
        <Label sm='3' for='select_meter'>
          Select Meter
        </Label>
        <Col sm='8' className=''>
          <Select
            isClearable={true}
            closeMenuOnSelect={false}
            theme={selectThemeColors}
            onChange={onMeterSelected}
            value={selectedmeterList}
            options={props.meterList}
            isSearchable
            isMulti={true}
            className='react-select border-secondary rounded'
            classNamePrefix='select'
            placeholder='Select meter ...'
          />
        </Col>
      </FormGroup> */}
      {/* <FormGroup row>
        <Label sm='3' for='select_meter'>
          Select Protocol
        </Label>
        <Col sm='8'>
          {/* Protocol Selection */}
      {/* <Select
            isClearable={true}
            theme={selectThemeColors}
            onChange={onProtocolSelected}
            value={selectedProtocol}
            options={protocols}
            isSearchable
            isMulti={false}
            className='react-select border-secondary rounded zindex_1009'
            classNamePrefix='select'
            placeholder='Protocol ...'
          />
        </Col>
      </FormGroup> */}

      <FormGroup row>
        <Label sm="3" for="select_meter">
          Select Command
        </Label>
        <Col sm="8">
          {/* Command Selection */}
          <Select
            isClearable={true}
            onChange={onCommandSelection}
            options={dlmsCommandList}
            value={selectedCommand}
            className="react-select zindex_999"
            classNamePrefix="select"
            isLoading={dlmsFetching}
            placeholder={
              dlmsFetching ? (
                <>
                  <Spinner color="" size="sm" />
                  <span className="ml-50">Loading...</span>
                </>
              ) : (
                'Select command ...'
              )
            }
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label sm="3" for="numberFrom">
          Retry count
        </Label>
        <Col sm="8">
          <Input
            id="numberFrom"
            type="text"
            value={retryCount}
            onChange={onRetryCount}
            placeholder="Enter Retry Count"
          />
        </Col>
      </FormGroup>
      {selectiveAccess ? (
        <FormGroup row>
          <Col sm="1" className="mb-1 pt_7 text-center">
            {isSelect ? (
              <Input
                type="checkbox"
                id="basic-cb-checked"
                className="cursor-pointer"
                checked
                onClick={() => setIsSelect(!isSelect)}
              />
            ) : (
              <Input
                type="checkbox"
                id="basic-cb-checked"
                className="cursor-pointer"
                onClick={() => setIsSelect(!isSelect)}
              />
            )}
          </Col>
          <Label
            sm="9"
            for="basic-cb-checked"
            className="font-weight-bold cursor-pointer"
          >
            Selective access
          </Label>
        </FormGroup>
      ) : (
        ''
      )}
      {/* {inputType ? <Row className='border w-100 mb-2'></Row> : ''} */}
      <Row>
        {inputType ? (
          inputType.includes('date') || inputType.includes('time') ? (
            inputType === 'timeRange' || inputType === 'dateTimeRange' ? (
              <>
                <Col lg="5" xs="6" className="mb-1">
                  <Flatpickr
                    id="timeFrom"
                    className="form-control zindex_99"
                    onClose={(value) => timeChangeHandler(value)}
                    placeholder="Select from range ..."
                    options={{
                      ...params,
                      maxDate: moment()
                        .subtract(1, 'day')
                        .endOf('day')
                        .toDate(),
                    }}
                  />
                </Col>
                <Col lg="5" xs="6" className="mb-1">
                  <Flatpickr
                    id="timeTo"
                    className="form-control zindex_99"
                    onClose={setToTime}
                    placeholder="Select to range ..."
                    options={{
                      ...params,
                      ...extraParams,
                      maxDate: moment().endOf('day').toDate(),
                    }}
                  />
                </Col>
              </>
            ) : (
              <Col lg="5" xs="6" className="mb-1">
                <Flatpickr
                  id="datePicker"
                  className="form-control zindex_99"
                  onClose={setDatePicker}
                  placeholder="Select date ..."
                  options={params}
                />
              </Col>
            )
          ) : inputType === 'range' ? (
            <Col lg="5" xs="6" className="mb-1 pl-2">
              <Nouislider
                className="mt-2"
                start={rangePicker}
                connect={true}
                step={1}
                tooltips={true}
                direction="ltr"
                range={params}
                onChange={setRangePicker}
              />
            </Col>
          ) : inputType === 'text' || inputType === 'number' ? (
            <Col lg="5" xs="6" className="mb-1">
              <Input
                id="textInput"
                type={inputType}
                value={valuePicker}
                onChange={fromNumberChangeHandler}
                placeholder="Insert the value."
                {...params}
              />
            </Col>
          ) : inputType === 'numberRange' ? (
            <>
              <Col lg="5" xs="6" className="mb-1">
                <Input
                  id="numberFrom"
                  type="number"
                  value={valuePicker}
                  onChange={fromNumberChangeHandler}
                  placeholder="insert from value."
                  {...params}
                />
              </Col>
              <Col lg="5" xs="6" className="mb-1">
                <Input
                  id="numberTo"
                  type="number"
                  value={toValue}
                  onChange={toNumberChangeHandler}
                  placeholder="insert to value."
                  {...params}
                />
              </Col>
            </>
          ) : inputType === 'activityCal1ph' ? (
            <>
              <Col lg="3" xs="3" className="mb-1">
                <Flatpickr
                  id="timeFrom"
                  className="form-control zindex_99"
                  onClose={setActiveCal1}
                  placeholder="Select tod 1 ..."
                  options={params}
                />
              </Col>
              <Col lg="3" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal2}
                  placeholder="Select tod 2 ..."
                  options={params}
                />
              </Col>
              <Col lg="3" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal3}
                  placeholder="Select tod 3 ..."
                  options={params}
                />
              </Col>
              <Col lg="3" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal4}
                  placeholder="Select tod 4 ..."
                  options={params}
                />
              </Col>
            </>
          ) : inputType === 'activityCal3ph' ? (
            <>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeFrom"
                  className="form-control zindex_99"
                  onClose={setActiveCal1}
                  placeholder="Select tod 1 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal2}
                  placeholder="Select tod 2 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal3}
                  placeholder="Select tod 3 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal4}
                  placeholder="Select tod 4 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal5}
                  placeholder="Select tod 5 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal6}
                  placeholder="Select tod 6 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal7}
                  placeholder="Select tod 7 ..."
                  options={params}
                />
              </Col>
              <Col lg="2" xs="3" className="mb-1">
                <Flatpickr
                  id="timeTo"
                  className="form-control zindex_99"
                  onClose={setActiveCal8}
                  placeholder="Select tod 8 ..."
                  options={params}
                />
              </Col>
            </>
          ) : inputType === 'select_text' || inputType === 'select_number' ? (
            <Col lg="5" md="6" xs="12" className="mb-1">
              <Select
                isClearable={true}
                theme={selectThemeColors}
                closeMenuOnSelect={!params.isMulti}
                onChange={setSelectedESW}
                options={params.options}
                value={selectedESW}
                isMulti={params.isMulti}
                className="react-select zindex_100"
                classNamePrefix="select"
                placeholder={params.placeholder}
              />
            </Col>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </Row>
      <FormGroup className="mb-0 " row>
        <Col
          sm="9"
          className="d-flex gap-1 align-items-center"
          md={{ size: 9, offset: 3 }}
        >
          <Button
            color={dlmsCommandExecuteReponse.isLoading ? 'primary' : 'success'}
            type="submit"
            onClick={submitCommmandRequest}
            className="btn-next w-25"
            disabled={dlmsCommandExecuteReponse.isLoading}
          >
            {dlmsCommandExecuteReponse.isLoading
              ? `${cmdSendCount} / ${selectedmeterList.length}`
              : 'Run'}
          </Button>
        </Col>
      </FormGroup>
    </>
  );
};

export default CommandExecutionSat;
