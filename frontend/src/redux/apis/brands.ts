import { customBaseQuery } from '@/src/lib/customBaseQuery';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the type for the brand object
interface Brand {
    id?: string;
    name?: string;
    description?: string;
    origin?: string;
    logo_url?: string;
}

// Define the type for the getBrands request body
interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?: 'name_asc' | 'name_desc' | 'created_at_asc' | 'created_at_desc';
    filter?: Record<string, any>;
}

export const brandsApi = createApi({
    reducerPath: 'brandsApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Brand'],
    endpoints: (builder) => ({
        getBrands: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: '/brand/list',
                method: 'POST',
                body: {
                    search: params.search,
                    skip: params.skip,
                    limit: params.limit,
                    sort: params.sort,
                    filter: { ...params.filter },
                },
            }),
            providesTags: ['Brand'],
        }),
        getBrand: builder.query({
            query: (id: string) => `/brand/${id}`,
            providesTags: (result, error, id) => [{ type: 'Brand', id }],
        }),
        createBrand: builder.mutation({
            query: (brand: Brand) => ({
                url: '/brand/create',
                method: 'POST',
                body: brand,
            }),
            // invalidatesTags: ['Brand'],
        }),
        updateBrand: builder.mutation({
            query: (brand: Brand) => ({
                url: `/brand/update/${brand?.id}`,
                method: 'PUT',
                body: {
                    name: brand?.name,
                    description: brand?.description,
                    origin: brand?.origin,
                    logo_url: brand?.logo_url,
                },
            }),
            invalidatesTags: (result, error, brand) => [
                'Brand',
                { type: 'Brand', id: brand?.id },
            ],
        }),
        deleteBrand: builder.mutation({
            query: (id: string) => ({
                url: `/brand/delete/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => ['Brand', { type: 'Brand', id }],
        }),
    }),
});

export const { useGetBrandsQuery, useGetBrandQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = brandsApi;