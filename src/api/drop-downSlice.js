// /api/hes/dlms/command-info/
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');
// Define a service using a base URL and expected endpoints
export const dropdownsApi = createApi({
  reducerPath: 'dropdownsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('module', 'hes');
      headers.set('vertical', 'utility');
      headers.set('project', 'lpdd');
      headers.set('username', 'abhishekaglave@grampower.com');
      headers.set('authorization', `Bearer ${token}`);
      headers.set('Unique_id', '1WK33A7M');
    },
  }),
  endpoints: (builder) => ({
    commandInfoDLMS: builder.query({
      query: () => ({
        url: 'hes/api/hes/dlms/command-info/',
      }),
    }),
    commandInfoAssets: builder.query({
      query: (params) => ({
        url: 'mdms/live/api/v1/get/gis/project/data',
        params: params,
      }),
      providesTags: ['assets'],
      invalidatesTags: ['asstes'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCommandInfoDLMSQuery, useCommandInfoAssetsQuery } =
  dropdownsApi;
