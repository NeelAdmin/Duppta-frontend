import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_URL = import.meta.env.VITE_BACKEND_URL;
// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL||'https://duppta-backend-1.onrender.com/api', // Update this with your API base URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stock', 'Design', 'Variant'], // Define tag types for cache invalidation
  endpoints: () => ({}), // Endpoints are injected from other files
});

// Export hooks for usage in functional components
export const { 
  middleware, 
  reducerPath, 
  reducer, 
  util 
} = api;
