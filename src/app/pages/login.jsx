import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'react-feather';

const Login = () => {
  const [isSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <img src={''} alt='Forgot password' />
          <h2 className='brand-text text-primary ml-1 pt-1'>AVDHAAN</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={''} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Welcome to Grampower!
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account.</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input
                  autoFocus
                  type='email'
                  id='login-email'
                  name='login-email'
                  placeholder='user@example.com'
                  onChange={(e) => setEmail(e.target.value)}
                  className={classnames({
                    'is-invalid': errors['login-email']
                  })}
                  {...register('login-email',{
                    required: true,
                    validate: (value) => value !== ''
                  })}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between align-items-center'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <div className='position-relative'>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    id='login-password'
                    name='login-password'
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className={classnames({
                      'is-invalid': errors['login-password']
                    })}
                    {...register('login-password',{
                      required: true,
                      validate: (value) => value !== ''
                    })}
                  />
                  {passwordVisible ? (
                    <EyeOff
                      size={14}
                      className='position-absolute end-0 mt-2 me-2'
                      onClick={() => setPasswordVisible(false)}
                    />
                  ) : (
                    <Eye
                      size={14}
                      className='position-absolute end-0 mt-2 me-2'
                      onClick={() => setPasswordVisible(true)}
                    />
                  )}
                </div>
              </FormGroup>
              <Button type='submit' color='primary' block disabled={isSigningIn}>
                {isSigningIn ? (
                  <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
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
