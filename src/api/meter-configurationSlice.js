import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../hooks/Headers';
import logoutApi from './logoutSlice';

const baseUrl = process.env.REACT_APP_BASE_URL;
const MDASUrl = process.env.REACT_APP_MDAS_URL;
const otherUrl = process.env.REACT_APP_OTHER_MODULES_URL;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: prepareHeaders,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.originalStatus;

    if (status === 401 || status === 403) {
      api.dispatch(logoutApi.endpoints.logout.initiate());
      localStorage.clear();
      window.location.href = '/';
    }
  }

  return result;
};

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
