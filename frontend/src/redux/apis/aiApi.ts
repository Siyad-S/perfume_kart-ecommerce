
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
    reducerPath: "aiApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
    endpoints: (builder) => ({
        getAiRecommendations: builder.query({
            query: (params) => ({
                url: "ai/recommend",
                method: "POST",
                body: params,
            }),
        }),
    }),
});

export const { useGetAiRecommendationsQuery, useLazyGetAiRecommendationsQuery } = aiApi;
