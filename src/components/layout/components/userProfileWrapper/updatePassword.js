import { useEffect, useState } from 'react';
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
import { jwtDecode } from 'jwt-decode';

const MySwal = withReactContent(Swal);

const UpdatePassword = () => {
  const [updatePassword, updatePasswordResponse] = useUpdatePasswordMutation();

  const [formValues, setFormValues] = useState({
    old_pass: '',
    password: '',
    password2: '',
    email: jwtDecode(localStorage.getItem('token')).userData.email,
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
      if (
        formValues.old_pass === formValues.password &&
        formValues.old_pass === formValues.password2
      ) {
        toast('New password should not be same as old password', {
          hideProgressBar: true,
          type: 'error',
        });
        return;
      }
      postUpdatePassword();
    }
  };

  const postUpdatePassword = () => {
    const payload = {
      ...formValues,
    };

    updatePassword(payload);
  };

  useEffect(() => {
    let statusCode = updatePasswordResponse?.data?.responseCode;
    if (statusCode === 200 || statusCode === 202) {
      MySwal.fire({
        icon: 'success',
        title: 'Please notice!',
        text: updatePasswordResponse.data?.data?.result?.success,
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
    } else if (
      updatePasswordResponse.isError &&
      updatePasswordResponse.error.code === 406
    ) {
      const error = updatePasswordResponse.error.data.data.error.message;
      toast(error, { hideProgressBar: true, type: 'error' });
    }
  }, [updatePasswordResponse]);

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
              <Button
                outline
                color="secondary"
                type="reset"
                onClick={() => {
                  setFormValues({
                    old_pass: '',
                    password: '',
                    password2: '',
                    email: jwtDecode(localStorage.getItem('token')).userData
                      .email,
                  });
                }}
              >
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
