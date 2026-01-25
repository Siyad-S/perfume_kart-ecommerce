// src/redux/apis/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { UserType, CartType, AddressType } from "@/src/types/user";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    tagTypes: ["User", "Cart", "Addresses", "Wishlist"],
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

        //get wishlist data
        getWishlist: builder.query<{ data: CartType[] }, string>({
            query: (id) => `user/wishlist/${id}`,
            providesTags: ["Wishlist"],
        }),

        // Get user addresses
        getAddresses: builder.query<{ data: AddressType[] }, string>({
            query: (id) => `user/addresses/${id}`,
            providesTags: ["Addresses"],
        }),

        // Forgot Password
        forgotPassword: builder.mutation<{ message: string }, { email: string; portal?: "user" | "admin" }>({
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
        // Toggle Wishlist
        toggleWishlist: builder.mutation<{ message: string; wishlist: CartType[] }, { id: string; productId: string }>({
            query: ({ id, productId }) => ({
                url: `user/wishlist/${id}`,
                method: "PATCH",
                body: { productId },
            }),
            invalidatesTags: ["Wishlist", "User"],
        }),
    }),
});

export const {
    useGetUserQuery,
    useUpdateUserMutation,
    useGetCartQuery,
    useGetWishlistQuery,
    useGetAddressesQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useToggleWishlistMutation,
} = userApi;
