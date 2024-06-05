import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../../hooks/Headers';
import logoutApi from '../logoutSlice';
import { loginApi } from '../loginSlice';
import { jwtDecode } from 'jwt-decode';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: prepareHeaders,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const originalStatus = result.error.originalStatus;

    if (status === 403 || originalStatus === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      api.dispatch(logoutApi.endpoints.logout.initiate(refreshToken));
      localStorage.clear();
      window.location.href = '/';
    } else if (status === 401 || originalStatus === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('token');
      if (
        (refreshToken !== 'undefined' && accessToken !== 'undefined') ||
        (refreshToken !== null && accessToken !== null)
      ) {
        if (accessToken && refreshToken) {
          const decodedToken = jwtDecode(accessToken);
          const decodedRefreshToken = jwtDecode(refreshToken);
          if (accessToken && decodedToken.exp < Date.now() / 1000) {
            if (refreshToken && decodedRefreshToken.exp > Date.now() / 1000) {
              const { data, error } = await api.dispatch(
                loginApi.endpoints.refreshToken.initiate()
              );
              if (data) {
                // Set the new access token to localStorage
                localStorage.setItem('token', data.data.result.access);
              } else {
                console.error(error);
              }
            }
          }
        } else {
          window.location.href = '/';
        }
      } else {
        window.location.href = '/';
      }
    }
  }

  return result;
};
