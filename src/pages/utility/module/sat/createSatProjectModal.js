import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { usePostSatFileMutation } from '../../../../api/sat';

const CreateSatProjectModal = (props) => {
  const [postSATFile, response] = usePostSatFileMutation();
  const [file, setFile] = useState(null);

  const postUploadFile = async (formData) => {
    postSATFile(formData);
  };

  useEffect(() => {
    if (response.status === 'fulfilled') {
      toast(`${response.data.message}`, {
        hideProgressBar: true,
        type: 'success',
      });
      props.setCenteredModal(false);
    } else if (response.isError) {
      toast('Something went wrong, please retry.');
    }
  }, [response]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    postUploadFile(formData);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormGroup row>
          <Label sm="3" for="exampleCustomFileBrowser">
            Import SAT Data
          </Label>
          <Col sm="5" className="">
            <Input
              type="file"
              id="exampleCustomFileBrowser"
              name="customFile"
              accept=".csv"
              required
              onChange={handleFileChange}
            />
          </Col>
        </FormGroup>
        <FormGroup className="mb-0 " row>
          <Col sm="9" className="d-flex  " md={{ size: 9, offset: 3 }}>
            <Button
              color="primary"
              type="submit"
              className="btn-next "
              disabled={response.isLoading}
            >
              <span className="align-middle">
                {response.isLoading ? 'Uploading...' : 'Upload'}
              </span>
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </>
  );
};

export default CreateSatProjectModal;
