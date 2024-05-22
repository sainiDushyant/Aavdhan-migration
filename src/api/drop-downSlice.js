// /api/hes/dlms/command-info/
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '../hooks/Headers';
import logoutApi from './logoutSlice';
const baseUrl = process.env.REACT_APP_BASE_URL;
const MDASUrl = process.env.REACT_APP_MDAS_URL;
const MDMSUrl = process.env.REACT_APP_OTHER_MODULES_URL;

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
