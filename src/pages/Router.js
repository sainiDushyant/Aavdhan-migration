import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import ForgotPassword from './forgotPassword';
import HesUtility from './utility/module/hes';
import MdmsUtility from './utility/module/mdms';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import SLA_Reports from './utility/module/sla-Reports';
import Sat from './utility/module/sat';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="utility/lpdd/hes"
          element={<LayoutWrapper children={<HesUtility />} />}
        />
        <Route
          path="utility/sbpdcl/hes"
          element={<LayoutWrapper children={<HesUtility />} />}
        />
        <Route
          path="utility/lpdd/mdms"
          element={<LayoutWrapper children={<MdmsUtility />} />}
        />
        <Route
          path="utility/sbpdcl/mdms"
          element={<LayoutWrapper children={<MdmsUtility />} />}
        />
        <Route
          path="utility/lpdd/sla-reports"
          element={<LayoutWrapper children={<SLA_Reports />} />}
        />
        <Route
          path="utility/sbpdcl/sla-reports"
          element={<LayoutWrapper children={<SLA_Reports />} />}
        />
        <Route
          path="utility/lpdd/sat"
          element={<LayoutWrapper children={<Sat />} />}
        />
        <Route
          path="utility/sbpdcl/sat"
          element={<LayoutWrapper children={<Sat />} />}
        />

        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
