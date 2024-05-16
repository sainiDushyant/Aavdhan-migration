// /api/hes/mdm/blockload/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');
const MDASUrl = process.env.REACT_APP_MDAS_URL;
// Define a service using a base URL and expected endpoints
export const pushDataApi = createApi({
  reducerPath: 'pushDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('module', 'hes');
      headers.set('vertical', 'utility');
      headers.set('project', 'lpdd');
      headers.set('username', 'abhishekaglave@grampower.com');
      headers.set('authorization', `Bearer ${token}`);
      headers.set('Unique_id', '1O7HZ4E3');
    },
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getBlockLoadData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/blockload/`,
        params: params,
      }),
    }),
    downloadPushData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/${
          params.report_name === 'block_load' ? 'blockload-push' : 'event-push'
        }-report-history/`,
        params,
      }),
    }),
    downloadFilteredPushData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/${
          params.report_name === 'block_load' ? 'blockload-push' : 'event-push'
        }-report-download/`,
        params: params,
      }),
    }),
  }),
});

export const {
  useGetBlockLoadDataQuery,
  useDownloadPushDataQuery,
  useDownloadFilteredPushDataQuery,
} = pushDataApi;

// blockLoadpush:/api/hes/dlms/blockload-push-report-history/
// eventPush:/api/hes/dlms/event-push-report-history/
// periodicPush:/api/hes/dlms/periodic-push-report-history/
