// src/redux/apis/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { addConfiguredExperimentalFeature } from "next/dist/server/config";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<{ user: { id: string; email: string } }, { email: string; password: string }>({
            query: (credentials) => ({
                url: "/user/login",
                method: "POST",
                body: credentials,
            }),
        }),
        signup: builder.mutation<{ user: { id: string; email: string } }, { name: string; email: string; password: string }>({
            query: (userData) => ({
                url: "/user/register",
                method: "POST",
                body: userData,
            }),
        }),
        getCurrentUser: builder.query<{ data: { user: { id: string; email: string, role: string } } }, void>({
            query: () => "admin/user/me",
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/user/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useGetCurrentUserQuery, useLogoutMutation } = authApi;
