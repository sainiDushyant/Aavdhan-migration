import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const sat = process.env.REACT_APP_SATTEST_URL;

export const satApi = createApi({
  reducerPath: 'satApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getTestCycles: builder.query({
      query: (params) => ({
        url: `${sat}/testcycles`,
        params: params,
      }),
      providesTags: ['testcycles'],
    }),
    postSatFile: builder.mutation({
      query: (data) => ({
        url: `${sat}/testcycles`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['testcycles'],
    }),
    getTests: builder.query({
      query: (params) => ({
        url: `${sat}/tests/fromcycle/${params.id}`,
      }),
      providesTags: ['tests'],
    }),
    postTests: builder.mutation({
      query: (data) => ({
        url: `${sat}/tests`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['tests'],
    }),
    updateExecutionIds: builder.mutation({
      query: (data) => ({
        url: `${sat}/tests`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['tests'],
    }),
    getTestsById: builder.query({
      query: (params) => ({
        url: `${sat}/tests/${params.id}`,
      }),
    }),
    generateTestReports: builder.query({
      query: (params) => ({
        url: `${sat}/tests/report/${params.id}`,
      }),
    }),
    getCmdResData: builder.query({
      query: (params) => ({
        url: `${sat}/testres/bytest/${params.id}`,
      }),
      providesTags: ['cmdResData'],
    }),
    postCmdResReq: builder.mutation({
      query: (params) => ({
        url: `${sat}/testres/requestcmdres/${params.id}`,
        method: 'POST',
      }),
      invalidatesTags: ['cmdResData'],
    }),
    copyTest: builder.mutation({
      query: (data) => ({
        url: `${sat}/tests/copy`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['tests'],
    }),
  }),
});

export const {
  useGetTestCyclesQuery,
  usePostSatFileMutation,
  useGetTestsQuery,
  usePostTestsMutation,
  useUpdateExecutionIdsMutation,
  useGetTestsByIdQuery,
  useLazyGenerateTestReportsQuery,
  useGetCmdResDataQuery,
  usePostCmdResReqMutation,
  useCopyTestMutation,
} = satApi;
