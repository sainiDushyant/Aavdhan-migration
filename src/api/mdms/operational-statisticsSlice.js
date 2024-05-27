import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_OTHER_MODULES_URL;
// Define a service using a base URL and expected endpoints
export const operationalStatsApi = createApi({
  reducerPath: 'operationalStatsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOperationalStatisticsEnergy: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/recharge/details`,
        params: params,
      }),
    }),
    getOperationalStatisticsRecharges: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/usage/stat`,
        params: params,
      }),
    }),
    getOperationalStatisticsMeterCount: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/prepaid/postpaid/count`,
        params: params,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetOperationalStatisticsEnergyQuery,
  useGetOperationalStatisticsRechargesQuery,
  useGetOperationalStatisticsMeterCountQuery,
} = operationalStatsApi;
