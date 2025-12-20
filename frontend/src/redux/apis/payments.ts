import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Payments"],
    endpoints: (builder) => ({
        verifyPayment: builder.mutation({
            query: (order) => ({
                url: "/payment/verify",
                method: "POST",
                body: order,
            }),
        }),
        retryPayment: builder.mutation({
            query: (order) => ({
                url: "/payment/retry",
                method: "POST",
                body: order,
            }),
        }),
        getPayments: builder.query({
            query: (params) => ({
                url: "/payment/list",
                method: "POST",
                body: {
                    search: params.search,
                    skip: params.skip,
                    limit: params.limit,
                    sort: params.sort,
                    filter: { ...params.filter },
                },
            }),
            providesTags: ["Payments"],
        }),
    }),
});

export const { useVerifyPaymentMutation, useRetryPaymentMutation, useGetPaymentsQuery } = paymentApi;