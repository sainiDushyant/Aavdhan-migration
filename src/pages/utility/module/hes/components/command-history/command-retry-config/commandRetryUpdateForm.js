// // ** Reactstrap Imports
import {
  Card,
  CardBody,
  Col,
  Input,
  Form,
  Button,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip,
} from 'reactstrap';

import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { toast } from 'react-toastify';

import { useUpdateDLMSCommandRetryCommandMutation } from '../../../../../../../api/hes/command-historySlice';

const CommandRetryUpDateForm = (props) => {
  const [updateCommandRetry, response] =
    useUpdateDLMSCommandRetryCommandMutation();

  const location = useLocation();

  let project = '';
  if (location.pathname.split('/')[2] === 'sbpdcl') {
    project = 'ipcl';
  } else {
    project = location.pathname.split('/')[2];
  }

  const [logout, setLogout] = useState(false);
  // useEffect(() => {
  //   if (logout) {
  //     authLogout(history, dispatch)
  //   }
  // }, [logout])

  const [retryCount, setRetryCount] = useState(props.rowSelected.command_retry);

  const onHandleChange = (val) => {
    // console.log(val.target.value)
    if (val) {
      setRetryCount(val.target.value);
    } else {
      setRetryCount(undefined);
    }
  };

  const onUpdateRetryCount = async () => {
    // console.log('Retry Count Updated .....')
    if (retryCount) {
      if (retryCount < 0) {
        toast('Retry count cannot be less than 0 ...', {
          hideProgressBar: true,
          type: 'warning',
        });
      } else {
        const params = {
          project,
          command: props.rowSelected.command,
          cmd_retry: retryCount,
        };
        updateCommandRetry(params);
      }
    } else {
      toast('Enter retry count ....', {
        hideProgressBar: true,
        type: 'warning',
      });
    }
  };

  useEffect(() => {
    if (response.isSuccess) {
      let statusCode = response?.data?.responseCode;
      if (statusCode === 202) {
        props.setShowDataEdit(false);
        toast('Retry count updated successfully .....', {
          hideProgressBar: true,
          type: 'success',
        });
      } else if (statusCode === 401 || statusCode === 403) {
        setLogout(true);
      } else {
        toast('Something went wrong, please retry ....', {
          hideProgressBar: true,
          type: 'warning',
        });
      }
    }
  }, [response]);

  return (
    <Card className="mb-0">
      <CardBody>
        <Row>
          <Col md="6" sm="12" className="mb-1">
            <Label className="form-label" for="name">
              Retry Count
            </Label>
            <Input
              type="number"
              defaultValue={retryCount}
              onChange={onHandleChange}
            />

            {/* <p className='text-danger'>{formErrors.username}</p> */}
          </Col>
        </Row>
        <Row>
          <Col className="d-flex" md={{ size: 9 }}>
            <Button
              className="me-1"
              color="primary"
              onClick={onUpdateRetryCount}
            >
              Update
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default CommandRetryUpDateForm;
