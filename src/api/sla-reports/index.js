import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_SlaReports;

export const slaReportsApi = createApi({
  reducerPath: 'slaReportsApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getBlockLoadSLA: builder.query({
      query: (params) => ({
        url: `${url}/sla/block-load`,
        params: params,
      }),
      providesTags: ['block-load-sla'],
    }),
    getDailyLoadSLA: builder.query({
      query: (params) => ({
        url: `${url}/sla/daily-load`,
        params: params,
      }),
      providesTags: ['daily-load-sla'],
    }),
    getBillingHistorySLA: builder.query({
      query: (params) => ({
        url: `${url}/sla/billing-history`,
        params: params,
      }),
      providesTags: ['billing-sla'],
    }),
  }),
});
export const {
  useGetBlockLoadSLAQuery,
  useGetDailyLoadSLAQuery,
  useGetBillingHistorySLAQuery,
} = slaReportsApi;
