import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// type RegisterRequest = {
//     name: string;
//     password: string;
//     mobile: string;
//     address: string;
// };

// type LoginRequest = {
//     mobile: string;
//     password: string;
// };

// type AuthResponse = {
//     success: boolean;
//     message: string;
//     accessToken: string;
//     refreshToken: string;
//     user: {
//         _id: string;
//         name: string;
//         mobile: number;
//         address: string;
//         role: string;
//         createdAt: string;
//         updatedAt: string;
//     };
// };

const API_URL = import.meta.env.VITE_BACKEND_URL;
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL || 'https://duppta-backend-1.onrender.com/api/',
        credentials: 'include',

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            console.log(token);
            
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        register: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            }),
        }),
    login: builder.mutation<any,any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            }),
        }),
        getAllUsers: builder.query<any, any>({
            query: () => ({
                url: '/auth/users',
                method: 'GET',
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation , useGetAllUsersQuery } = authApi;
