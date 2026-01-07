import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface Banner {
    id?: string;
    banner_url?: string;
    product_id?: string;
    category_id?: string;
    home_slider?: boolean;
    home_sub?: boolean;
    category_listing?: boolean;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?: "createdAt_asc" | "createdAt_desc";
    filter?: Record<string, any>;
}

export const adminBannersApi = createApi({
    reducerPath: "adminBannersApi",
    baseQuery: customBaseQuery,
    tagTypes: ["AdminBanner"],
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: "/admin/banner/list",
                method: "POST",
                body: params,
            }),
            providesTags: ["AdminBanner"],
        }),
        getBanner: builder.query({
            query: (id: string) => `/admin/banner/${id}`,
            providesTags: (result, error, id) => [{ type: "AdminBanner", id }],
        }),
        createBanner: builder.mutation({
            query: (banner: Banner) => ({
                url: "/admin/banner/create",
                method: "POST",
                body: banner,
            }),
            invalidatesTags: ["AdminBanner"],
        }),
        updateBanner: builder.mutation({
            query: (banner: Banner) => ({
                url: `/admin/banner/update/${banner.id}`,
                method: "PUT",
                body: banner,
            }),
            invalidatesTags: (result, error, banner) => [
                "AdminBanner",
                { type: "AdminBanner", id: banner?.id },
            ],
        }),
        deleteBanner: builder.mutation({
            query: (id: string) => ({
                url: `/admin/banner/delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => ["AdminBanner", { type: "AdminBanner", id }],
        }),
    }),
});

export const {
    useGetBannersQuery: useAdminGetBannersQuery,
    useGetBannerQuery: useAdminGetBannerQuery,
    useCreateBannerMutation: useAdminCreateBannerMutation,
    useUpdateBannerMutation: useAdminUpdateBannerMutation,
    useDeleteBannerMutation: useAdminDeleteBannerMutation,
} = adminBannersApi;
