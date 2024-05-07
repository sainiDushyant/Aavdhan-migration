import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import HesUtility from "./pages/utility/module/hes";
import LayoutWrapper from "./components/layout/layoutWrapper";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="utility/lpdd/hes" element={<LayoutWrapper children={<HesUtility />}/>} />

        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App