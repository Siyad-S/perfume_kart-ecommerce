import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface Brand {
  id?: string;
  name?: string;
  description?: string;
  origin?: string;
  logo_url?: string;
}

interface ListRequestType {
  search?: string;
  skip?: number | null;
  limit?: number | null;
  sort?: 'name_asc' | 'name_desc' | 'createdAt_asc' | 'createdAt_desc';
  filter?: Record<string, any>;
}

export const adminBrandsApi = createApi({
  reducerPath: "adminBrandsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["AdminBrand"],
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params: Partial<ListRequestType> = {}) => ({
        url: "/admin/brand/list",
        method: "POST",
        body: params,
      }),
      providesTags: ["AdminBrand"],
    }),
    getBrand: builder.query({
      query: (id: string) => `/admin/brand/${id}`,
      providesTags: (result, error, id) => [{ type: "AdminBrand", id }],
    }),
    createBrand: builder.mutation({
      query: (brand: Brand) => ({
        url: "/admin/brand/create",
        method: "POST",
        body: brand,
      }),
      invalidatesTags: ["AdminBrand"],
    }),
    updateBrand: builder.mutation({
      query: (brand: Brand) => ({
        url: `/admin/brand/update/${brand.id}`,
        method: "PUT",
        body: brand,
      }),
      invalidatesTags: (result, error, brand) => [
        "AdminBrand",
        { type: "AdminBrand", id: brand?.id },
      ],
    }),
    deleteBrand: builder.mutation({
      query: (id: string) => ({
        url: `/admin/brand/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => ["AdminBrand", { type: "AdminBrand", id }],
    }),
  }),
});

export const {
  useGetBrandsQuery: useAdminGetBrandsQuery,
  useGetBrandQuery: useAdminGetBrandQuery,
  useCreateBrandMutation: useAdminCreateBrandMutation,
  useUpdateBrandMutation: useAdminUpdateBrandMutation,
  useDeleteBrandMutation: useAdminDeleteBrandMutation,
} = adminBrandsApi;
