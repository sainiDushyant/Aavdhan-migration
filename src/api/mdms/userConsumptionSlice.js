import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_OTHER_MODULES_URL;
const dlmsUrl = process.env.REACT_APP_MDAS_URL;

// Define a service using a base URL and expected endpoints
export const userConsumptionApi = createApi({
  reducerPath: 'userConsumptionApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMDMSMeterConnectionStatus: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/meter/connection/status`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getAssetHierarchyWiseMeterAlerts: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/event-push/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getAssetHierarchyWiseSystemAlerts: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/system/alerts`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),
    getPullBasedTamperEvent: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/tamper-events/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),

    //Fetch User profile

    getUserPersonalInformationUpdated: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/get/consumer/details/dlms`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),

    // Billing history

    getUserBillingHistory: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/consumer/get/billing/history`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),

    // Daily load

    getMDMSUserDailyLoadData: builder.query({
      query: (params) => ({
        url: `${dlmsUrl}/api/hes/mdm/dailyload/`,
        params: params,
      }),
      keepUnusedDataFor: 300,
    }),

    // Meter Recharge related
    putOfflineRecharge: builder.mutation({
      query: (data) => ({
        url: `${url}/api/v1/put/offline/recharge`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Change Meter mode

    updateMeterMode: builder.query({
      query: (params) => ({
        url: `${url}/api/v1/change/connection/type`,
        params: params,
      }),
      keepUnusedDataFor: 2,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMDMSMeterConnectionStatusQuery,
  useGetAssetHierarchyWiseMeterAlertsQuery,
  useGetPullBasedTamperEventQuery,
  useGetAssetHierarchyWiseSystemAlertsQuery,
  useGetUserPersonalInformationUpdatedQuery,
  useGetUserBillingHistoryQuery,
  useGetMDMSUserDailyLoadDataQuery,
  usePutOfflineRechargeMutation,
  useLazyUpdateMeterModeQuery,
} = userConsumptionApi;
