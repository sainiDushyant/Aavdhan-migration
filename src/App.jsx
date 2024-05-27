import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import HesUtility from './pages/utility/module/hes';
import MdmsUtility from './pages/utility/module/mdms';
import LayoutWrapper from './components/layout/LayoutWrapper';
import jwtDecode from 'jwt-decode';
import { useRefreshTokenMutation } from './api/loginSlice';
import { toast } from 'react-toastify';

const App = () => {
  const [tokenRefresh, tokenRefreshResponse] = useRefreshTokenMutation();
  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    // Check if refreshToken is 'undefined' (string) or null
    if (refreshToken === 'undefined' || !refreshToken) {
      window.location.href = '/';
      return;
    }

    // Check if accessToken is 'undefined' (string) or null
    if (accessToken === 'undefined' || !accessToken) {
      window.location.href = '/';
      return;
    }

    // Check token expiration
    if (accessToken && refreshToken) {
      const decodedToken = jwtDecode(accessToken);
      const decodedRefreshToken = jwtDecode(refreshToken);

      if (decodedToken.exp < Date.now() / 1000 && decodedRefreshToken.exp > Date.now() / 1000) {
        tokenRefresh();
      }
    }

    // Handle the response of the token refresh
    if (tokenRefreshResponse.status === 'fulfilled') {
      if (tokenRefreshResponse.isSuccess) {
        localStorage.setItem('accessToken', tokenRefreshResponse.data.data.result.access);
        localStorage.setItem('refreshToken', tokenRefreshResponse.data.data.result.refresh);
      } else if (tokenRefreshResponse.isError) {
        toast('Failed to get new token. Please logout and login again', {
          hideProgressBar: true,
          type: 'error',
        });
        window.location.href = '/';
      }
    }
  }, [accessToken, refreshToken, tokenRefreshResponse, tokenRefresh]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="utility/lpdd/hes"
          element={<LayoutWrapper><HesUtility /></LayoutWrapper>}
        />
        <Route
          path="utility/sbpdcl/hes"
          element={<LayoutWrapper><HesUtility /></LayoutWrapper>}
        />
        <Route
          path="utility/lpdd/mdms"
          element={<LayoutWrapper><MdmsUtility /></LayoutWrapper>}
        />
        <Route
          path="utility/sbpdcl/mdms"
          element={<LayoutWrapper><MdmsUtility /></LayoutWrapper>}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
