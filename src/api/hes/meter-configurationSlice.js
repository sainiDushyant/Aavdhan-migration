import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const MDASUrl = process.env.REACT_APP_MDAS_URL;
const otherUrl = process.env.REACT_APP_OTHER_MODULES_URL;

// Define a service using a base URL and expected endpoints
export const meterConfigurationApi = createApi({
  reducerPath: 'meterConfigurationApi',
  baseQuery: baseQueryWithReauth,
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
    editCommunicationProtocol: builder.query({
      query: (params) => ({
        url: `${MDASUrl}/api/hes/mdm/meter-communication-protocol/`,
        params: {
          meter: params.meter,
          communication_protocol: params.communication_protocol,
        },
      }),
    }),
  }),
});
export const {
  useGetMeterConfigurationListQuery,
  useDownloadMeterConfigurationRequestReportQuery,
  useLazyDownloadMeterConfigurationReportQuery,
  useGetMeterMetaDataQuery,
  useLazyEditCommunicationProtocolQuery,
} = meterConfigurationApi;
