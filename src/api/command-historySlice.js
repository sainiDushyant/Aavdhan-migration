import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../hooks/Headers';
import logoutApi from './logoutSlice';

const baseUrl = process.env.REACT_APP_BASE_URL;
const MDASUrl = process.env.REACT_APP_MDAS_URL;

// Custom fetchBaseQuery with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: prepareHeaders,
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
} = commandHistoryApi;
