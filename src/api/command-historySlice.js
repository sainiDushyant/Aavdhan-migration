import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');
const MDASUrl = process.env.REACT_APP_MDAS_URL;
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
      headers.set('Unique_id', '1O7HZ4E3');
    },
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getMdasDlmsCommandHistory: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/command-history/`,
        params: params,
      }),
    }),
    getMdasTapCommandHistory: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/tap/command-history/`,
        params: params,
      }),
    }),
    getMdasDlmsHistoryData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/execution-status-resp/`,
        params: params,
      }),
    }),
    getCommandHistoryTAPDetail: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/tap/command-history-resp/`,
        params: params,
      }),
    }),
    getCommandRetryConfigData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/read-command-retry/`,
        params: params,
      }),
      providesTags: ['CommandRetryConfigData'],
    }),
    updateDLMSCommandRetryCommand: builder.mutation({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/update-command-retry/`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['CommandRetryConfigData'],
    }),
    getDLMSDataDownloadRequestHistory: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/command-report-download/`,
        params: params,
      }),
      providesTags: ['DLMSDataDownloadRequestHistory'],
    }),
    DLMSDataDownloadRequest: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/command-history-report-download/`,
        params: params,
      }),
      invalidatesTags: ['DLMSDataDownloadRequestHistory'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMdasDlmsCommandHistoryQuery,
  useGetMdasTapCommandHistoryQuery,
  useLazyGetMdasDlmsHistoryDataQuery,
  useGetCommandHistoryTAPDetailQuery,
  useGetCommandRetryConfigDataQuery,
  useUpdateDLMSCommandRetryCommandMutation,
  useGetDLMSDataDownloadRequestHistoryQuery,
  useLazyDLMSDataDownloadRequestQuery,
} = commandHistoryApi;
