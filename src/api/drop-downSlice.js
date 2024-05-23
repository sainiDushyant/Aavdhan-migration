// /api/hes/dlms/command-info/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './utils/baseQueryWithAuth';

const MDASUrl = process.env.REACT_APP_MDAS_URL;
const MDMSUrl = process.env.REACT_APP_OTHER_MODULES_URL;

// Define a service using a base URL and expected endpoints
export const dropdownsApi = createApi({
  reducerPath: 'dropdownsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    commandInfoDLMS: builder.query({
      query: () => ({
        url: `${MDASUrl}/api/hes/dlms/command-info/`,
      }),
    }),
    commandInfoAssets: builder.query({
      query: (params) => ({
        url: `${MDMSUrl}/api/v1/get/gis/project/data`,
        params: params,
      }),
    }),
    GISMetersList: builder.query({
      query: (params) => ({
        url: `${MDMSUrl}/api/v1/get/gis/meters/list`,
        params: params,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCommandInfoDLMSQuery,
  useCommandInfoAssetsQuery,
  useLazyGISMetersListQuery,
} = dropdownsApi;
