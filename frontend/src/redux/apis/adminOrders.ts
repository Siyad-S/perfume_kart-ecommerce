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

export const adminOrderApi = createApi({
    reducerPath: "adminOrderApi",
    baseQuery: customBaseQuery,
    tagTypes: ['AdminOrders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: "aadmin/order/create",
                method: "POST",
                body: order,
            }),
        }),
        updateOrder: builder.mutation({
            query: (order) => ({
                url: `admin/order/update/${order.id}`,
                method: "PATCH",
                body: order,
            }),
            invalidatesTags: (result, error, order) => [
                "AdminOrders",
                { type: "AdminOrders", id: order?.id },
            ],
        }),
        deleteOrder: builder.mutation({
            query: (id: string) => ({
                url: `/admin/order/delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [
                "AdminOrders",
                { type: "AdminOrders", id },
            ],
        }),
        getOrders: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: "/admin/order/list",
                method: "POST",
                body: params,
            }),
            providesTags: ["AdminOrders"],
        }),
    }),
});

export const {
    useCreateOrderMutation: useCreateAdminOrderMutation,
    useUpdateOrderMutation: useUpdateAdminOrderMutation,
    useDeleteOrderMutation: useDeleteAdminOrderMutation,
    useGetOrdersQuery: useGetAdminOrdersQuery
} = adminOrderApi;
