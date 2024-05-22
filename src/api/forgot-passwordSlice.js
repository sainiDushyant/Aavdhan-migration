import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getPreparedHeaders } from '../hooks/Headers';
import logoutApi from './logoutSlice';
const baseUrl = process.env.REACT_APP_BASE_URL;
const loginUrl = process.env.REACT_APP_LOGIN_URL;

const { vertical, project, module, token, username, uniqueId } =
  getPreparedHeaders();
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    // prepareHeaders: (headers) => {
    //   headers.set('Vertical', 'forgot-password');
    // },
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
        headers: {
          Vertical: 'forgot-password',
        },
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/otp-verification`,
        method: 'POST',
        body: { ...data },
        headers: {
          Vertical: 'forgot-password',
        },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/change/password/`,
        method: 'POST',
        body: { ...data },
        headers: {
          Vertical: 'forgot-password',
        },
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${loginUrl}/users/forget/password/`,
        method: 'POST',
        body: { ...data },
        headers: {
          Authorization: `Bearer ${token}`,
          Unique_id: uniqueId,
          username: username,
          project: project,
          vertical: vertical,
          module: module,
        },
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
  useUpdatePasswordMutation,
} = forgotPasswordApi;
