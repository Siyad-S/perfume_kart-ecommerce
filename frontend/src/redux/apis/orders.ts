
import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?:
    'order_date_asc' | 'order_date_desc'
    | 'created_at_asc' | 'created_at_desc'
    | 'total_price_asc' | 'total_price_desc'
    | 'paid_at_asc' | 'paid_at_desc'
    | 'total_amount_asc' | 'total_amount_desc'
    filter?: Record<string, any>;
}

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: customBaseQuery,
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: "/order/create",
                method: "POST",
                body: order,
            }),
        }),
        getOrders: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: "/order/list",
                method: "POST",
                body: params,
            }),
            providesTags: ["orders"],
        }),
        updateOrder: builder.mutation({
            query: (order) => ({
                url: `/order/update/${order.id}`,
                method: "PATCH",
                body: order,
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
    useUpdateOrderMutation,
} = orderApi;