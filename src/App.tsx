import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import HesUtility from './pages/utility/module/hes';
import LayoutWrapper from './components/layout/LayoutWrapper';

const App = () => {
  const [collapsed, setCollapsed] = useState();
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="utility/lpdd/hes"
          element={
            <LayoutWrapper collapsed={collapsed} setCollapsed={setCollapsed}>
              <HesUtility collapsed={collapsed} />{' '}
            </LayoutWrapper>
          }
        />
        <Route
          path="utility/sbpdcl/hes"
          element={
            <LayoutWrapper collapsed={collapsed} setCollapsed={setCollapsed}>
              <HesUtility collapsed={collapsed} />{' '}
            </LayoutWrapper>
          }
        />

        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
