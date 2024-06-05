import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from 'reactstrap';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usePostTestsMutation } from '../../../../api/sat';

const ConfigreTestSatModal = (props) => {
  const [formData, setformData] = useState({
    passingCriteria: '',
    expResTime: '',
    sampleCount: '',
  });
  const [postTests, response] = usePostTestsMutation();

  useEffect(() => {
    formData.testCycleId = props.rowData.id;
  }, [props.rowData.id]);

  const handlechange = (event) => {
    const name = event.target.name;
    const value = event.target.value.replace(/[^0-9]/g, '');
    setformData((values) => ({ ...values, [name]: value }));
  };

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (!(formData.passingCriteria >= 1 && formData.passingCriteria <= 100)) {
      toast('Passing Criteria must be between 1 to 100', {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    } else if (
      !(
        formData.sampleCount >= 1 &&
        formData.sampleCount <= props.rowData?.metersCount
      )
    ) {
      toast(`Sample count must be between 1 to ${props.rowData?.metersCount}`, {
        hideProgressBar: true,
        type: 'warning',
      });
      return false;
    } else {
      if (!formData.sampleCount) {
        formData.sampleCount = props.rowData?.metersCount;
      }

      postTests(formData);
    }
  };

  useEffect(() => {
    if (response.status === 'fulfilled') {
      toast(response.data?.message, {
        hideProgressBar: true,
        type: 'success',
      });
      props.setTestSatModal(false);
    } else if (response.isError) {
      toast('Something went wrong, please retry.');
    }
  }, [response]);

  return (
    <>
      <Form onSubmit={onHandleSubmit}>
        <FormGroup row>
          <Label sm="3" for="passing_criteria">
            Passing Criteria (%)
          </Label>
          <Col sm="8" className="">
            <Input
              type="text"
              value={formData.passingCriteria}
              onChange={handlechange}
              id="passing_criteria"
              name="passingCriteria"
              placeholder="90"
              required
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label sm="3" for="reply_time">
            Exp. Res Time (sec)
          </Label>
          <Col sm="8" className="">
            <Input
              type="text"
              id="reply_time"
              value={formData.expResTime}
              onChange={handlechange}
              name="expResTime"
              placeholder="3"
              required
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label sm="3" for="Sample_size">
            Sample Size ( Max : {props.rowData?.metersCount} )
          </Label>
          <Col sm="8" className="">
            <Input
              type="text"
              value={formData.sampleCount}
              onChange={handlechange}
              id="Sample_size"
              name="sampleCount"
              max={props.rowData?.metersCount}
              placeholder={props.rowData?.metersCount}
            />
          </Col>
        </FormGroup>
        <FormGroup className="mb-0 " row>
          <Col sm="9" className="d-flex" md={{ size: 9, offset: 3 }}>
            <Button
              color="primary"
              type="submit"
              className="btn-next "
              disabled={response.isLoading}
            >
              {response.isLoading ? <Spinner size="sm" /> : 'Submit'}
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </>
  );
};

export default ConfigreTestSatModal;
