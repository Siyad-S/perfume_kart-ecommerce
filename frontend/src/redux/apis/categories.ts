import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the type for the category object
interface Category {
    id?: string;
    name?: string;
    description?: string;
    //   [key: string]: any; // Allow additional fields as needed
}

// Define the type for the getCategories request body
interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?: 'name_asc' | 'name_desc' | 'created_at_asc' | 'created_at_desc';
    filter?: Record<string, any>;
}

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    tagTypes: ['Category', 'MegaMenu'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: '/category/list',
                method: 'POST',
                body: {
                    search: params.search || '',
                    skip: params.skip || null,
                    limit: params.limit || null,
                    sort: params.sort || 'created_at_desc',
                    filter: { ...params.filter },
                },
            }),
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (category: Category) => ({
                url: '/category/create',
                method: 'POST',
                body: category,
            }),
            // invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: (category: Category) => ({
                url: `/category/update/${category?.id}`,
                method: 'PUT',
                body: category,
            }),
            invalidatesTags: (result, error, category) => [
                'Category',
                { type: 'Category', id: category?.id },
            ],
        }),
        deleteCategory: builder.mutation({
            query: (id: string) => ({
                url: `/category/delete/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => ['Category', { type: 'Category', id }],
        }),
        getMegaMenu: builder.query<any, void>({
            query: () => ({
                url: '/category/mega-menu',
                method: 'GET',
            }),
            providesTags: ['MegaMenu'],
        }),
    }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetMegaMenuQuery } = categoriesApi;