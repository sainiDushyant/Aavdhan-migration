import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');
// Define a service using a base URL and expected endpoints
export const commandHistoryApi = createApi({
  reducerPath: 'commandHistory',
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
    getMdasDlmsCommandHistory: builder.query({
      query: (params) => ({
        url: 'hes/api/hes/dlms/command-history/',
        params: params,
      }),
    }),
    getMdasTapCommandHistory: builder.query({
      query: (params) => ({
        url: 'hes/api/hes/tap/command-history/',
        params: params,
      }),
    }),
    getMdasDlmsHistoryData: builder.query({
      query: (params) => ({
        url: 'hes/api/hes/dlms/execution-status-resp/',
        params: params,
      }),
    }),
    getCommandHistoryTAPDetail: builder.query({
      query: (params) => ({
        url: 'hes/api/hes/tap/command-history-resp/',
        params: {},
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetMdasDlmsCommandHistoryQuery,
  useLazyGetMdasTapCommandHistoryQuery,
  useLazyGetMdasDlmsHistoryDataQuery,
  useGetCommandHistoryTAPDetailQuery,
} = commandHistoryApi;
