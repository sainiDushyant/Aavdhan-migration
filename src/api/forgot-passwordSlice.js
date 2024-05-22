import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import logoutApi from './logoutSlice';
const baseUrl = process.env.REACT_APP_BASE_URL;
const loginUrl = process.env.REACT_APP_LOGIN_URL;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Vertical', 'forgot-password');
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.originalStatus;
    if (status === 401 || status === 403) {
      api.dispatch(logoutApi.endpoints.logout.initiate());
      localStorage.clear();
      window.location.href = '/';
    }
  }

  return result;
};
// Define a service using a base URL and expected endpoints
export const forgotPasswordApi = createApi({
  reducerPath: 'forgotPassword',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    generateOTP: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/otp-generation`,
        method: 'POST',
        body: { ...data },
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/otp-verification`,
        method: 'POST',
        body: { ...data },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/change/password/`,
        method: 'POST',
        body: { ...data },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useChangePasswordMutation,
} = forgotPasswordApi;
