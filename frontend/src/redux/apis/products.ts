import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the type for Product object (adjust fields as per your DB model)
interface Product {
  id?: string;
  title?: string;
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
  image_files?: File[];
  banner_file?: File;
  tags?: string[];
  category_id?: string;
  best_seller?: boolean;
  trending?: boolean;
  new_launch?: boolean;
}

// Allowed sorting options for products
export type ProductSort =
  | 'name_asc'
  | 'name_desc'
  | 'createdAt_asc'
  | 'createdAt_desc'
  | 'price_asc'
  | 'price_desc';

interface ListRequestType {
  search?: string;
  skip?: number | null;
  limit?: number | null;
  sort?: ProductSort;
  filter?: Record<string, any>;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['Product', 'globalSearch'],
  endpoints: (builder) => ({
    // POST /product/list
    getProducts: builder.query({
      query: (params: Partial<ListRequestType> = {}) => ({
        url: '/product/list',
        method: 'POST',
        body: {
          search: params.search,
          skip: params.skip,
          limit: params.limit,
          sort: params.sort,
          filter: { ...params.filter },
        },
      }),
      providesTags: ['Product'],
    }),

    // GET /product/:id
    getProduct: builder.query({
      query: (id: string) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // POST /product (create)
    createProduct: builder.mutation({
      query: (product: Product) => ({
        url: '/product',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    // PUT /product/update/:id
    updateProduct: builder.mutation({
      query: (product: Product) => ({
        url: `/product/update/${product?.id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, product) => [
        'Product',
        { type: 'Product', id: product?.id },
      ],
    }),

    // PUT /product/delete/:id
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/product/delete/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => ['Product', { type: 'Product', id }],
    }),
    // POST /product/global-search
    globalSearch: builder.query({
      query: (params: Partial<ListRequestType> = {}) => ({
        url: '/product/global-search',
        method: 'POST',
        body: {
          search: params.search,
          skip: params.skip,
          limit: params.limit,
          filter: { ...params.filter },
        },
      }),
      providesTags: ['globalSearch'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGlobalSearchQuery,
} = productsApi;
