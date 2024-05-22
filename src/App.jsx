import React, { useEffect} from 'react';
import { HashRouter, Routes, Route, useFetcher } from 'react-router-dom';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import HesUtility from './pages/utility/module/hes';
import LayoutWrapper from './components/layout/LayoutWrapper';
import { jwtDecode } from 'jwt-decode';
import { useRefreshTokenMutation } from './api/loginSlice';
import { toast } from 'react-toastify';


const App = () => {

  const [tokenRefresh,tokenRefreshResponse]=useRefreshTokenMutation()
  const accessToken = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  if(typeof accessToken === 'string'){
    const decodedToken = jwtDecode(accessToken) 
  const decodedRefreshToken = jwtDecode(refreshToken)
if(accessToken && decodedToken.exp<Date.now()/1000){
        if(refreshToken && decodedRefreshToken.exp > Date.now() / 1000){
            tokenRefresh()
        }
}
  }
  

useEffect(()=>{
  if(tokenRefreshResponse.status === 'fulfilled'){
    if(tokenRefreshResponse.isSuccess){
      localStorage.setItem('accessToken',tokenRefreshResponse.data.data.result.access)
      localStorage.setItem('refreshToken',refreshToken)
    }
    else if (tokenRefreshResponse.isError){
      toast('Failed to get new token. Please logout and login again',{hideProgressBar:true,type:'error'})
    }
  }
},[tokenRefreshResponse])

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

        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
