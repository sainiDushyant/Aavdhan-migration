import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App