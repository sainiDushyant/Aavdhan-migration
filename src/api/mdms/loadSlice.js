import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const dlmsUrl = process.env.REACT_APP_MDAS_URL;
// Define a service using a base URL and expected endpoints
export const loadsApi = createApi({
  reducerPath: 'loadsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMDMSGroupMeterDailyLoadData: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/group-history/daily-load/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getMDMSGroupMeterBlockLoadData: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/group-history/block-load/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getMDMSGroupMeterBillingHistoryData: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/group-history/billing-history/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetMDMSGroupMeterDailyLoadDataQuery,
  useLazyGetMDMSGroupMeterBlockLoadDataQuery,
  useLazyGetMDMSGroupMeterBillingHistoryDataQuery,
} = loadsApi;
