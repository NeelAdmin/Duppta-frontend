import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Variant {
  _id: string;
  designId: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddVariantRequest {
  designId: string;
  color: string;
}

export interface Variant {
  _id: string;
  color: string;
}

export interface DesignWithVariants {
  designName: string;
  variants: Variant[];
}
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const variantApi = createApi({
  reducerPath: 'variantApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL || 'https://duppta-backend-1.onrender.com/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Variant'],
  endpoints: (builder) => ({
    getVariants: builder.query<any, void>({
  query: () => '/varient/all',
  providesTags: ['Variant'],
}),
    addVariant: builder.mutation<any, any>({
      query: (body) => ({
        url: '/varient/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Variant'],
    }),
    deleteVariant: builder.mutation<any, any>({
      query: (id) => ({
        url: `/varient/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Variant'],
    }),
  }),
});

export const { 
  useGetVariantsQuery, 
  useAddVariantMutation, 
  useDeleteVariantMutation 
} = variantApi;
