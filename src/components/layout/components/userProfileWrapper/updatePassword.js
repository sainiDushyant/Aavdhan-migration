import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Form,
  Button,
  Label,
  InputGroup,
} from 'reactstrap';
import InputPasswordToggle from '../../../../@core/components/input-password-toggle';
import { useUpdatePasswordMutation } from '../../../../api/forgot-passwordSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UpdatePassword = () => {
  const [updatePassword] = useUpdatePasswordMutation();

  const [formValues, setFormValues] = useState({
    old_pass: '',
    password: '',
    password2: '',
  });

  const handleConfirmText = async () => {
    const result = await MySwal.fire({
      text: 'Are you sure you want to update it?',
      title: 'Are you sure!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      customClass: {
        confirmButton: 'btn btn-primary me-1',
        cancelButton: 'btn btn-outline-danger ',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      postUpdatePassword();
    }
  };

  const postUpdatePassword = async () => {
    try {
      const response = await updatePassword({
        old_pass: formValues.old_pass,
        password: formValues.password,
      }).unwrap();

      let statusCode = response?.responseCode;
      if (statusCode === 200 || statusCode === 202) {
        MySwal.fire({
          icon: 'success',
          title: 'Please notice!',
          text: response?.data?.result?.success,
          customClass: {
            confirmButton: 'btn btn-success',
          },
        }).then(() => {
          setFormValues({
            old_pass: '',
            password: '',
            password2: '',
          });
        });
      } else if (statusCode === 406) {
        const error = response?.data?.error;
        const swalConfig = {
          icon: 'error',
          title: 'Failed!',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        };

        if (error?.detail) {
          swalConfig.text = error.detail;
        } else if (error?.message) {
          swalConfig.text = error.message;
        } else if (error?.password) {
          swalConfig.html = error.password
            .map((msg) => `<p>${msg}</p>`)
            .join('');
        }

        MySwal.fire(swalConfig);
      }
    } catch (error) {
      toast('Something went wrong', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  };

  const onChangePassword = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValues.password === formValues.password2) {
      handleConfirmText();
    } else {
      toast('Re-check Password.', {
        hideProgressBar: true,
        type: 'error',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">New Password</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup row>
            <Label sm="4" for="old_pass">
              Old Password
            </Label>
            <Col sm="8">
              <InputGroup className="input-group-merge">
                <InputPasswordToggle
                  id="old_pass"
                  name="old_pass"
                  className="input-group-merge"
                  value={formValues.old_pass}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm="4" for="password">
              New Password
            </Label>
            <Col sm="8">
              <InputGroup className="input-group-merge">
                <InputPasswordToggle
                  id="password"
                  name="password"
                  className="input-group-merge"
                  value={formValues.password}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm="4" for="password2">
              Confirm New Password
            </Label>
            <Col sm="8">
              <InputGroup className="input-group-merge">
                <InputPasswordToggle
                  id="password2"
                  name="password2"
                  className="input-group-merge"
                  value={formValues.password2}
                  onChange={onChangePassword}
                  required
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup className="mb-0" row>
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>
              <Button className="me-1" color="primary" type="submit">
                Submit
              </Button>
              <Button outline color="secondary" type="reset">
                Reset
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default UpdatePassword;
