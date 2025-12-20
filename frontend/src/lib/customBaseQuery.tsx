import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // important: sends cookies automatically
});

export const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh token (refresh token is in HttpOnly cookie)
        const refreshResult = await rawBaseQuery("/user/refresh", api, extraOptions);

        if (refreshResult?.meta?.response?.ok) {
            // Refresh succeeded → retry the original request
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            // Refresh failed → logout user (optional)
            // api.dispatch(logout());
        }
    }

    return result;
};
