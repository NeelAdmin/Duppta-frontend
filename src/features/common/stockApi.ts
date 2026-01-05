// src/features/common/stockApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Stock {
  _id: string;
  designId: string;
  variantId: string;
  meter: number;
  unit: number;
  cutBy?: string;
  fitBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddStockRequest {
  designId: string;
  variantId: string;
  meter: number;
  unit: number;
}

export interface DashboardVariant {
  color: string;
  meter: number;
  unit: number;
}

export interface DashboardStockItem {
  variant: DashboardVariant[];
  design: string;
}

export interface DashboardStockResponse {
  success: boolean;
  data: DashboardStockItem[];
}

export interface UpdateStockRequest extends AddStockRequest {
  _id: string;
  cutBy?: string;
  fitBy?: string;
}
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL || 'https://duppta-backend-1.onrender.com/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      console.log(token);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stock'],
  endpoints: (builder) => ({
    getStocks: builder.query<{ stock: Stock[] }, void>({
      query: () => '/stock/get',
      providesTags: ['Stock'],
    }),
    addStock: builder.mutation<Stock, AddStockRequest>({
      query: (body) => ({
        url: '/stock/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stock'],
    }),
    updateStock: builder.mutation<Stock, UpdateStockRequest>({
      query: ({ _id, ...body }) => ({
        url: `/stock/${_id}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stock'],
    }),
    deleteStock: builder.mutation<void, string>({
      query: (id) => ({
        url: `/stock/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stock'],
    }),
    getUserWork: builder.query<{ stock:any }, void>({
      query: () => '/stock/get-assigned-stocks',
      providesTags: ['Stock'],
    }),
    // Inside the endpoints object in stockApi.ts
    getDashboardStock: builder.query<DashboardStockResponse, { fromDate: string; toDate: string }>({
      query: ({ fromDate, toDate }) => ({
        url: '/dashboard/dashboard-stock',
        params: { fromDate, toDate },
      }),
      providesTags: ['Stock'],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useAddStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
  useGetUserWorkQuery,
  useGetDashboardStockQuery
} = stockApi;