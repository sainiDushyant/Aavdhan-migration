import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQueryWithAuth';

const url = process.env.REACT_APP_LOGIN_URL;

export const userAccessPanelApi = createApi({
  reducerPath: 'userAccessPanelApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getUserAccessList: builder.query({
      query: (params) => ({
        url: `${url}/users/all-users`,
        params: params,
      }),
      providesTags: ['userAccessList'],
    }),
    deleteUser: builder.mutation({
      query: (params) => ({
        url: `${url}/users/delete-user/${params.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['userAccessList'],
    }),
    getAllVerticals: builder.query({
      query: () => ({
        url: `${url}/users/all-verticals`,
      }),
    }),
    getReportsList: builder.query({
      query: () => ({
        url: `${url}/users/all-report-detail`,
      }),
    }),
    getTagsList: builder.query({
      query: (params) => ({
        url: `${url}/users/all-tag`,
        params: params,
      }),
    }),
    updateUserData: builder.mutation({
      query: ({ method, ...data }) => ({
        url: `${url}/users/signup`,
        method: method,
        body: data,
      }),
      invalidatesTags: ['userAccessList'],
    }),
  }),
});
export const {
  useGetUserAccessListQuery,
  useDeleteUserMutation,
  useGetAllVerticalsQuery,
  useGetReportsListQuery,
  useLazyGetTagsListQuery,
  useUpdateUserDataMutation,
} = userAccessPanelApi;
