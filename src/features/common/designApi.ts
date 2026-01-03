import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type DesignRequest = {
  name: string;
  ratePerUnit: string | number;
  ratePerMeter: string | number;
};

export type Design = {
  _id?: string;
  name: string;
  ratePerUnit: string | number;
  ratePerMeter: string | number;
};
const API_URL = import.meta.env.BACKEND_URL;
export const designApi = createApi({
  reducerPath: 'designApi', // unique slice
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL || 'http://localhost:5000/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Design'],
  endpoints: (build) => ({
    getDesigns: build.query<Design[], void>({
      query: () => '/design/all',
      providesTags: ['Design'],
    }),

    addDesign: build.mutation<Design, DesignRequest>({
      query: (body) => ({
        url: '/design/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Design'],
    }),
    updateDesign: build.mutation({
      query: (body) => ({
        url: `/design/${body?.id}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Design'],
    }),
    deleteDesign: build.mutation<Design, string>({
      query: (id) => ({
        url: `/design/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Design'],
    }),
  }),
});

export const { useGetDesignsQuery, useAddDesignMutation, useUpdateDesignMutation, useDeleteDesignMutation } = designApi;
