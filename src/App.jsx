import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import HesUtility from './pages/utility/module/hes';
import MdmsUtility from './pages/utility/module/mdms';
import LayoutWrapper from './components/layout/LayoutWrapper';


const App = () => {
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

        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
