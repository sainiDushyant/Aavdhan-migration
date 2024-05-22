// features/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../hooks/Headers';
const baseUrl = process.env.REACT_APP_BASE_URL;

const logoutApi = createApi({
  reducerPath: 'logoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/users/auth/logout/`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
export default logoutApi;
