import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'react-feather';
import { useLoginMutation } from '../api/loginSlice';
import { toast } from 'react-toastify';
import '../@core/scss/base/pages/page-auth.scss';

const Login = () => {
  const [login, response] = useLoginMutation();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { ref: emailRef, ...registerEmail } = register('username', {
    required: true,
    validate: (value) => value !== '',
  });
  const { ref: passwordRef, ...registerPassword } = register('password', {
    required: true,
    validate: (value) => value !== '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLoading } = response;

  const onSubmit = (data) => {
    login(data);
  };
  useEffect(() => {
    if (response?.data?.responseCode === 200) {
      toast('You are successfully logged in.', {
        hideProgressBar: true,
        type: 'success',
      });
      localStorage.setItem('token', response?.data?.data?.result?.access);
      localStorage.setItem(
        'refreshToken',
        response?.data?.data?.result?.refresh
      );
      localStorage.setItem('uniqueId', response?.data?.data?.result?.unique_id);
      navigate('utility/lpdd/hes');
    } else if (response.isError) {
      toast('Invalid Credentials', { hideProgressBar: true, type: 'error' });
    }
  }, [response]);

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Col className="position-absolute">
          <Link
            className="brand-logo text-decoration-none l-0 d-flex align-items-center gap-2"
            to="/"
            onClick={(e) => e.preventDefault()}
          >
            <img
              src={`polaris-logo.svg`}
              alt="Avdhaan"
              style={{ height: '40px', width: '40px' }}
            />
            <h1
              className="brand-text ml-1 pt-1"
              style={{ color: 'rgb(115, 103, 240)' }}
            >
              Avdhaan
            </h1>
          </Link>
        </Col>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={'login-v2.svg'} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle
              tag="h2"
              className="font-weight-bold mb-1 color: #808080"
            >
              Welcome to Grampower!
            </CardTitle>
            <CardText className="mb-2 color: #808080">
              Please sign-in to your account.
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  autoFocus
                  type="email"
                  id="login-email"
                  name="login-email"
                  placeholder="user@example.com"
                  className={classnames({
                    'is-invalid': errors['email'],
                  })}
                  innerRef={emailRef}
                  {...registerEmail}
                />
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between align-items-center">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link className="text-decoration-none" to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <div className="position-relative d-flex align-items-center">
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    id="login-password"
                    name="login-password"
                    placeholder="Enter Password"
                    className={classnames({
                      'is-invalid': errors['password'],
                    })}
                    innerRef={passwordRef}
                    {...registerPassword}
                  />
                  {passwordVisible ? (
                    <EyeOff
                      size={14}
                      className="position-absolute end-0 me-2 cursor-pointer"
                      onClick={() => setPasswordVisible(false)}
                    />
                  ) : (
                    <Eye
                      size={14}
                      className="position-absolute end-0 me-2 cursor-pointer "
                      onClick={() => setPasswordVisible(true)}
                    />
                  )}
                </div>
              </FormGroup>
              <Button type="submit" color="primary" block disabled={isLoading}>
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
