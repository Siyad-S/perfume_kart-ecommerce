import { customBaseQuery } from '@/src/lib/customBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

// Define the type for the banner object
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

// Define the type for the getBanners request body
interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?: 'createdAt_asc' | 'createdAt_desc';
    filter?: Record<string, any>;
}

export const bannersApi = createApi({
    reducerPath: 'bannersApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: '/banner/list',
                method: 'POST',
                body: {
                    search: params.search,
                    skip: params.skip,
                    limit: params.limit,
                    sort: params.sort,
                    filter: { ...params.filter },
                },
            }),
            providesTags: ['Banner'],
        }),
        getBanner: builder.query({
            query: (id: string) => `/banner/${id}`,
            providesTags: (result, error, id) => [{ type: 'Banner', id }],
        }),
        createBanner: builder.mutation({
            query: (banner: Banner) => ({
                url: '/banner/create',
                method: 'POST',
                body: banner,
            }),
            // invalidatesTags: ['Banner'],
        }),
        updateBanner: builder.mutation({
            query: (banner: Banner) => ({
                url: `/banner/update/${banner?.id}`,
                method: 'PUT',
                body: {
                    banner_url: banner?.banner_url,
                    product_id: banner?.product_id,
                    category_id: banner?.category_id,
                    home_slider: banner?.home_slider,
                    home_sub: banner?.home_sub,
                    category_listing: banner?.category_listing,
                    is_deleted: banner?.is_deleted,
                },
            }),
            invalidatesTags: (result, error, banner) => [
                'Banner',
                { type: 'Banner', id: banner?.id },
            ],
        }),
        deleteBanner: builder.mutation({
            query: (id: string) => ({
                url: `/banner/delete/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => ['Banner', { type: 'Banner', id }],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannerQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannersApi;
