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
        getUser: builder.query<{ data: { user: UserType } }, void>({
            query: () => "admin/user/me",
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
    }),
});

export const {
    useGetUserQuery,
    useUpdateUserMutation,
    useGetCartQuery,
    useGetAddressesQuery,
} = userApi;
