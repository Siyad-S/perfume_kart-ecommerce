import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?:
    | 'created_at_asc' | 'created_at_desc'
    | 'amount_asc' | 'amount_desc'
    filter?: Record<string, any>;
}

export const adminPaymentApi = createApi({
    reducerPath: "adminPaymentApi",
    baseQuery: customBaseQuery,
    tagTypes: ["adminPayments"],
    endpoints: (builder) => ({
        getPayments: builder.query({
            query: (params: ListRequestType) => ({
                url: "admin/payment/list",
                method: "POST",
                body: params,
            }),
            providesTags: ["adminPayments"],
        }),
        deletePayment: builder.mutation({
            query: (id: string) => ({
                url: `admin/payment/delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [
                "adminPayments",
                { type: "adminPayments", id },
            ],
        }),
    }),
});

export const {
    useGetPaymentsQuery: useAdminGetPaymentsQuery,
    useDeletePaymentMutation: useAdminDeletePaymentMutation
} = adminPaymentApi;
