// features/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../hooks/Headers';
const baseUrl = process.env.REACT_APP_BASE_URL;
const loginUrl = process.env.REACT_APP_LOGIN_URL;

const refreshToken = localStorage.getItem('refreshToken');

const logoutApi = createApi({
  reducerPath: 'logoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: `${loginUrl}/users/auth/logout/`,
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
export default logoutApi;
