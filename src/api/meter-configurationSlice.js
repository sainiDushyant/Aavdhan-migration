// /api/hes/mdm/meterConfiguration/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');
const MDASUrl = process.env.REACT_APP_MDAS_URL;
const otherUrl = process.env.REACT_APP_OTHER_MODULES_URL;
// Define a service using a base URL and expected endpoints
export const meterConfigurationApi = createApi({
  reducerPath: 'meterConfigurationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('module', 'hes');
      headers.set('vertical', 'utility');
      headers.set('project', 'lpdd');
      headers.set('username', 'abhishekaglave@grampower.com');
      headers.set('authorization', `Bearer ${token}`);
      headers.set('Unique_id', '1O7HZ4E3');
    },
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    //Meter configuration APIs

    getMeterConfigurationList: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/meter-configuration-data/`,
        params: params,
      }),
    }),
    downloadMeterConfigurationRequestReport: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/meter-config-request_report-download/`,
        params: params,
      }),
    }),
    downloadMeterConfigurationReport: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/dlms/meter-config-report-download/`,
        params: params,
      }),
    }),

    // Meter Configuration Data Modal APIs
    getMeterMetaData: builder.query({
      query: (params) => ({
        url: `${otherUrl}/api/v1/get/gis/search`,
        params: params,
      }),
    }),
  }),
});
export const {
  useGetMeterConfigurationListQuery,
  useDownloadMeterConfigurationRequestReportQuery,
  useLazyDownloadMeterConfigurationReportQuery,
  useGetMeterMetaDataQuery,
} = meterConfigurationApi;
