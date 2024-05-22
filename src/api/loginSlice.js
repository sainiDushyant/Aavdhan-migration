import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import logoutApi from './logoutSlice';
const baseUrl = process.env.REACT_APP_BASE_URL;
const loginUrl = process.env.REACT_APP_LOGIN_URL;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.originalStatus;

    if (status === 401) {
      api.dispatch(logoutApi.endpoints.logout.initiate());
      localStorage.clear();
      window.location.href = '/';
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginDetails) => ({
        url: `${loginUrl}/users/auth/login/`,
        method: 'POST',
        body: { ...loginDetails },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = loginApi;
