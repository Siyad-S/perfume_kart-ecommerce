import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "@/src/lib/customBaseQuery";

export const supportApi = createApi({
    reducerPath: "supportApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        contactSupport: builder.mutation<
            { success: boolean; message: string },
            { name: string; email: string; message: string; }
        >({
            query: (body) => ({
                url: "support/contact",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useContactSupportMutation } = supportApi;
