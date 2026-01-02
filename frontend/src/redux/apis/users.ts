// src/redux/apis/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { UserType, CartType, AddressType } from "@/src/types/user";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    tagTypes: ["User", "Cart", "Addresses"],
    endpoints: (builder) => ({
        // Get logged-in user
        getUser: builder.query<{ data: { user: UserType } }, string | void>({
            query: (endpoint) => endpoint || "user/me",
            providesTags: ["User"],
        }),

        // Update user details
        updateUser: builder.mutation<
            { data: { user: UserType } },
            { id: string; updates: Partial<UserType> } & {
                address?: AddressType;
            }
        >({
            query: ({ id, updates }) => ({
                url: `user/update/${id}`,
                method: "PATCH",
                body: updates, // only send updated fields
            }),
            invalidatesTags: ["User", "Cart"],
        }),

        //get cart data
        getCart: builder.query<{ data: CartType[] }, string>({
            query: (id) => `user/cart/${id}`,
            providesTags: ["Cart"],
        }),

        // Get user addresses
        getAddresses: builder.query<{ data: AddressType[] }, string>({
            query: (id) => `user/addresses/${id}`,
            providesTags: ["Addresses"],
        }),

        // Forgot Password
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: `user/forgot-password`,
                method: "POST",
                body,
            }),
        }),

        // Reset Password
        resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: ({ token, password }) => ({
                url: `user/reset-password/${token}`,
                method: "POST",
                body: { password },
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useUpdateUserMutation,
    useGetCartQuery,
    useGetAddressesQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = userApi;
