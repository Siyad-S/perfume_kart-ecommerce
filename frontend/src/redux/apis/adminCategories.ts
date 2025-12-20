import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface Category {
    id?: string;
    name?: string;
    description?: string;
}

interface ListRequestType {
    search?: string;
    skip?: number | null;
    limit?: number | null;
    sort?: 'name_asc' | 'name_desc' | 'created_at_asc' | 'created_at_desc';
    filter?: Record<string, any>;
}

export const adminCategoriesApi = createApi({
    reducerPath: "adminCategoriesApi",
    baseQuery: customBaseQuery,
    tagTypes: ["AdminCategory"],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params: Partial<ListRequestType> = {}) => ({
                url: "/admin/category/list",
                method: "POST",
                body: params,
            }),
            providesTags: ["AdminCategory"],
        }),
        createCategory: builder.mutation({
            query: (category: Category) => ({
                url: "/admin/category/create",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["AdminCategory"],
        }),
        updateCategory: builder.mutation({
            query: (category: Category) => ({
                url: `/admin/category/update/${category.id}`,
                method: "PUT",
                body: category,
            }),
            invalidatesTags: (result, error, category) => [
                "AdminCategory",
                { type: "AdminCategory", id: category?.id },
            ],
        }),
        deleteCategory: builder.mutation({
            query: (id: string) => ({
                url: `/admin/category/delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [
                "AdminCategory",
                { type: "AdminCategory", id },
            ],
        }),
    }),
});

export const {
    useGetCategoriesQuery: useAdminGetCategoriesQuery,
    useCreateCategoryMutation: useAdminCreateCategoryMutation,
    useUpdateCategoryMutation: useAdminUpdateCategoryMutation,
    useDeleteCategoryMutation: useAdminDeleteCategoryMutation,
} = adminCategoriesApi;
