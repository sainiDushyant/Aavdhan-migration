import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_OTHER_MODULES_URL;
const dlmsUrl = process.env.REACT_APP_MDAS_URL;
// Define a service using a base URL and expected endpoints
export const energyConsumptionApi = createApi({
  reducerPath: 'energyConsumptionApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAssetsenergyConsumption: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/consumption/details`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getMDMSGroupMeterDailyLoadData: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/group-history/daily-load/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAssetsenergyConsumptionQuery,
  useLazyGetMDMSGroupMeterDailyLoadDataQuery,
} = energyConsumptionApi;
