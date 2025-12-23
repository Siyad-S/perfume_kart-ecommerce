import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminAnalyticsApi = createApi({
    reducerPath: "adminAnalyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics`,
    }),
    tagTypes: ["DashboardStats"],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => "/dashboard",
            providesTags: ["DashboardStats"],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = adminAnalyticsApi;
