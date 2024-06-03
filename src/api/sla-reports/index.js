import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_SLA_REPORTS;

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
    }),
    getDailyLoadSLA: builder.query({
      query: (params) => ({
        url: `${url}/sla/daily-load`,
        params: params,
      }),
    }),
  }),
});
export const { useGetBlockLoadSLAQuery, useGetDailyLoadSLAQuery } =
  slaReportsApi;
