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
import { useCopyTestMutation } from '../../../../api/sat';

const CopyTestConfig = (props) => {
  const [formData, setformData] = useState({
    passingCriteria: props.testsRowsData.passingCriteria,
    expResTime: props.testsRowsData.expResTime,
    id: props.testsRowsData.id,
  });

  const [copyTest, copyTestResponse] = useCopyTestMutation();

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
    } else {
      if (!formData.sampleCount) {
        formData.sampleCount = props.rowData?.meters?.length;
      }
      copyTest(formData);
    }
  };

  useEffect(() => {
    if (copyTestResponse.status === 'fulfilled') {
      toast(copyTestResponse.data.message, {
        hideProgressBar: true,
        type: 'success',
      });
      props.updatedTestConfigModal(false);
    } else if (copyTestResponse.isError) {
      if (
        copyTestResponse.error.code === 400 ||
        copyTestResponse.error.code === 500
      ) {
        toast(copyTestResponse.error.message, {
          hideProgressBar: true,
          type: 'error',
        });
      } else {
        toast('Something went wrong please retry .', {
          hideProgressBar: true,
          type: 'error',
        });
      }
    }
  }, [copyTestResponse]);

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
            Sample Size ( Max : {props.rowData?.meters?.length} )
          </Label>
          <Col sm="8" className="">
            <Input
              type="text"
              value={props.testsRowsData.sampleSize}
              onChange={handlechange}
              id="Sample_size"
              name="sampleCount"
              disabled
              max={props.rowData?.meters?.length}
              placeholder={props.rowData?.meters?.length}
            />
          </Col>
        </FormGroup>
        <FormGroup className="mb-0 " row>
          <Col sm="9" className="d-flex" md={{ size: 9, offset: 3 }}>
            <Button
              color="primary"
              type="submit"
              className="btn-next  w-25"
              disabled={copyTestResponse.isLoading}
            >
              {copyTestResponse.isLoading ? <Spinner size="sm" /> : 'Submit'}
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </>
  );
};

export default CopyTestConfig;
