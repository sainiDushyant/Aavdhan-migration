// /api/hes/mdm/blockload/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const MDASUrl = process.env.REACT_APP_MDAS_URL;

// Define a service using a base URL and expected endpoints
export const pushDataApi = createApi({
  reducerPath: 'pushDataApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getBlockLoadData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/blockload/`,
        params: params,
      }),
    }),
    getPushBasedEvent: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/event-push/`,
        params: params,
      }),
    }),
    getBillingData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/get-billing-data/`,
        params: params,
      }),
    }),
    downloadPushData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/${
          params.report_name === 'block_load'
            ? 'blockload-push-report-history'
            : params.report_name === 'billing_data'
            ? 'billing-data-request_report-download'
            : 'event-push-report-history'
        }/`,
        params,
      }),
    }),
    downloadFilteredPushData: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/${
          params.report_name === 'block_load'
            ? 'blockload-push-report-download'
            : params.report_name === 'billing_data'
            ? 'billing-data-report'
            : 'event-push-report-download'
        }/`,
        params: params,
      }),
    }),
  }),
});

export const {
  useGetBlockLoadDataQuery,
  useDownloadPushDataQuery,
  useLazyDownloadFilteredPushDataQuery,
  useGetPushBasedEventQuery,
  useGetBillingDataQuery,
} = pushDataApi;
