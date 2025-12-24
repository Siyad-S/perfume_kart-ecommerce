import { customBaseQuery } from "@/src/lib/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

interface Product {
  id?: string;
  name: string;
  description: string;
  brand_id?: string;
  price: number;
  discount_price: number;
  stock_quantity: number;
  sku: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  tags?: string[];
  category_id?: string;
  best_seller?: boolean;
  trending?: boolean;
  new_launch?: boolean;
}

interface ListRequestType {
  search?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

export const adminProductsApi = createApi({
  reducerPath: "adminProductsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["AdminProduct"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params: Partial<ListRequestType> = {}) => ({
        url: "/admin/product/list",
        method: "POST",
        body: params,
      }),
      providesTags: ["AdminProduct"],
    }),
    getProduct: builder.query({
      query: (id: string) => `/admin/product/${id}`,
      providesTags: (result, error, id) => [{ type: "AdminProduct", id }],
    }),
    createProduct: builder.mutation({
      query: (product: Product) => ({
        url: "/admin/product/create",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["AdminProduct"],
    }),
    updateProduct: builder.mutation({
      query: (product: Product) => ({
        url: `/admin/product/update/${product.id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (result, error, product) => [
        "AdminProduct",
        { type: "AdminProduct", id: product?.id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/admin/product/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => ["AdminProduct", { type: "AdminProduct", id }],
    }),
  }),
});

export const {
  useGetProductsQuery: useAdminGetProductsQuery,
  useGetProductQuery: useAdminGetProductQuery,
  useCreateProductMutation: useAdminCreateProductMutation,
  useUpdateProductMutation: useAdminUpdateProductMutation,
  useDeleteProductMutation: useAdminDeleteProductMutation,
} = adminProductsApi;
