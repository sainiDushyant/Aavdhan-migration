import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const MDASUrl = process.env.REACT_APP_MDAS_URL;
const otherUrl = process.env.REACT_APP_OTHER_MODULES_URL;

// Custom fetchBaseQuery with error handling

// Define a service using the customized baseQuery and expected endpoints
export const commandHistoryApi = createApi({
  reducerPath: 'commandHistory',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getMdasDlmsCommandHistory: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/command-history/`,
        params: params,
      }),
      providesTags: ['DlmsCommandHistory'],
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
    executeDlmsCommand: builder.mutation({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/execute-command/`,
        method: 'POST',
        body: { data: params },
      }),
      invalidatesTags: ['DlmsCommandHistory'],
    }),
    GISMeterSearch: builder.query({
      query: (params) => ({
        url: `${otherUrl}/api/v1/get/gis/search`,
        params: params,
      }),
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
  useExecuteDlmsCommandMutation,
  useLazyGISMeterSearchQuery,
} = commandHistoryApi;
