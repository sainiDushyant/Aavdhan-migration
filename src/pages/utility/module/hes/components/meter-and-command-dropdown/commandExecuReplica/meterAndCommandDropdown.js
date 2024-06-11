import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';

import {
  useCommandInfoDLMSQuery,
  useCommandInfoAssetsQuery,
} from '../../../../../../../api/hes/drop-downSlice';

import { ChevronDown, X } from 'react-feather';

import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch, batch } from 'react-redux';
import CommandTab from './index';

import CardInfo from '../../../../../../../components/ui-elements/cards/cardInfo';
import {
  setMDASAssetList,
  setMDASDlmsCommandList,
} from '../../../../../../../app/redux/commandExecutionSlice';

const MeterAndCommandDropDown = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const projectName =
    location.pathname.split('/')[2] === 'sbpdcl'
      ? 'ipcl'
      : location.pathname.split('/')[2];
  const verticalName = location.pathname.split('/')[1];

  const {
    data: commandInfoDLMSData,
    isError: CommandInfoDLMSQueryError,
    refetch: refetch1,
    isFetching: commandInfoDLMSQueryLoading,
  } = useCommandInfoDLMSQuery();
  const {
    data: commandInfoAssetsResponse,
    isError: commandInfoAssetsError,
    refetch: refetch2,
    isFetching: commandInfoAssetsLoading,
  } = useCommandInfoAssetsQuery({
    project: projectName,
    vertical: verticalName,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const collapsed = useSelector((state) => state.layout.collapsed);

  useEffect(() => {
    let statusCodeDLMS = commandInfoDLMSData?.responseCode;
    if (statusCodeDLMS) {
      if (statusCodeDLMS === 200) {
        let dlmsCommandList;
        dlmsCommandList = commandInfoDLMSData?.data?.result;
        dispatch(setMDASDlmsCommandList(dlmsCommandList));
      }
    }
  }, [commandInfoDLMSData]);

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

        const assets = {
          pss_list,
          feeder_list,
          dtr_list,
        };
        dispatch(setMDASAssetList(assets));
      }
    }
  }, [commandInfoAssetsResponse]);

  const [dropDownStyle, setDropDownStyle] = useState('translateY(-100%)');
  const [tabActive, setTabActive] = useState('1');
  const [icoToggle, setIcoToggle] = useState(true);

  const toggleCommandExecutionModal = (val) => {
    setIcoToggle(!icoToggle);
    dropDownStyle === 'translateY(0)'
      ? setDropDownStyle('translateY(-100%)')
      : setDropDownStyle('translateY(0)');
    if (icoToggle) {
      document.getElementById('notch').firstChild.innerHTML =
        '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
      document.getElementById('notch').firstChild.innerHTML =
        '<polyline points="6 9 12 15 18 9"></polyline>';
    }
  };

  const retryAgain = () => {
    if (commandInfoAssetsError) {
      refetch2();
    } else if (CommandInfoDLMSQueryError) {
      refetch1();
    }
  };

  console.log(collapsed, 'this is collapsed');

  return (
    <Col
      className={`p-0 ${
        collapsed === true ? 'sidebar-collapsed' : 'meter_command_floating'
      }`}
      style={{ transform: dropDownStyle }}
    >
      <Card className="mb-0">
        <CardHeader className="p-1">
          <Row className="w-100">
            <Col lg="11" md="10" xs="9">
              <h3 className="mt_12">Command Execution</h3>
            </Col>
            <Col lg="1" md="2" xs="3">
              <Button
                className="btn-icon px_1 py_1 mt_12 mx-1"
                id="positionTop"
                outline
                color="danger"
                onClick={(e) => toggleCommandExecutionModal(e)}
              >
                <X size={16} />
              </Button>
              <UncontrolledTooltip placement="top" target="positionTop">
                Close
              </UncontrolledTooltip>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          {commandInfoAssetsError || CommandInfoDLMSQueryError ? (
            <CardInfo
              props={{
                message: { errorMessage },
                retryFun: { retryAgain },
                retry: { commandInfoDLMSQueryLoading } || {
                  commandInfoAssetsLoading,
                },
              }}
            />
          ) : (
            !(commandInfoAssetsLoading || commandInfoDLMSQueryLoading) && (
              <>
                <>
                  {/* <MeterCommandExecution
                      // pss_list={responseAssetList.responseData.pss_list}
                      // dlms_command_list={responseDLSMCommandList.responseData}
                      // tap_command_list={repsonseTAPCommandList.responseData}
                      refreshCommandHistory={props.refreshCommandHistory}
                      projectName={projectName}
                      toggleCommandExecutionModal={toggleCommandExecutionModal}
                      protocolSelectedForCommandExecution={props.protocolSelectedForCommandExecution}
                    /> */}
                  <CommandTab
                    refreshCommandHistory={props.refreshCommandHistory}
                    projectName={projectName}
                    toggleCommandExecutionModal={toggleCommandExecutionModal}
                    protocolSelectedForCommandExecution={
                      props.protocolSelectedForCommandExecution
                    }
                  />
                </>
                {/* )} */}
              </>
            )
          )}
        </CardBody>
      </Card>
      <div
        className="notch"
        id="notch"
        onClick={(e) => toggleCommandExecutionModal(e)}
      >
        <ChevronDown className="ChevronDown_ico" size={20} />
      </div>
    </Col>
  );
};

export default MeterAndCommandDropDown;
