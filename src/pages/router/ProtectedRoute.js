import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  const token = localStorage.getItem('token');
  return token !== null && token !== 'undefined';
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
