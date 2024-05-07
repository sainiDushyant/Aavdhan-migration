import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
// Define a service using a base URL and expected endpoints
export const forgotPasswordApi = createApi({
  reducerPath: 'forgotPassword',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Vertical', 'forgot-password');
    },
  }),
  endpoints: (builder) => ({
    generateOTP: builder.mutation({
      query: (data) => ({
        url: '/sso/users/otp-generation',
        method: 'POST',
        body: { ...data },
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/sso/users/otp-verification',
        method: 'POST',
        body: { ...data },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: 'sso/users/change/password/',
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
