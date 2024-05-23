import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { prepareHeaders } from '../../hooks/Headers';
import logoutApi from '../logoutSlice';

const baseUrl = process.env.REACT_APP_BASE_URL;
const refreshToken = localStorage.getItem('refreshToken');

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: prepareHeaders,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401 || status === 403) {
      api.dispatch(logoutApi.endpoints.logout.initiate(refreshToken));
      localStorage.clear();
      window.location.href = '/';
    }
  }

  return result;
};
