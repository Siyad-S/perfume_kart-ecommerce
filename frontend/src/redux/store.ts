import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./apis/products";
import { brandsApi } from "./apis/brands";
import { categoriesApi } from "./apis/categories"
import fileReducer from "./slices/file"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/auth"
import { adminCategoriesApi } from "./apis/adminCategories";
import { adminProductsApi } from "./apis/adminProducts";
import { adminBrandsApi } from "./apis/adminBrands";
import { authApi } from "./apis/auth";
import { bannersApi } from "./apis/banners";
import { adminBannersApi } from "./apis/adminBanners";
import categoriesReducer from "./slices/categories"
import { userApi } from "./apis/users"
import { orderApi } from "./apis/orders"
import { paymentApi } from "./apis/payments"
import { adminOrderApi } from "./apis/adminOrders"
import { adminPaymentApi } from "./apis/adminPayments";
import brandsReducer from "./slices/brands";

export const store = configureStore({
    reducer: {
        [brandsApi.reducerPath]: brandsApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [adminCategoriesApi.reducerPath]: adminCategoriesApi.reducer,
        [adminBrandsApi.reducerPath]: adminBrandsApi.reducer,
        [adminProductsApi.reducerPath]: adminProductsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [bannersApi.reducerPath]: bannersApi.reducer,
        [adminBannersApi.reducerPath]: adminBannersApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [adminOrderApi.reducerPath]: adminOrderApi.reducer,
        [adminPaymentApi.reducerPath]: adminPaymentApi.reducer,
        file: fileReducer,
        auth: authReducer,
        categories: categoriesReducer,
        brands: brandsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(productsApi.middleware)
            .concat(brandsApi.middleware)
            .concat(categoriesApi.middleware)
            .concat(adminCategoriesApi.middleware)
            .concat(adminBrandsApi.middleware)
            .concat(adminProductsApi.middleware)
            .concat(authApi.middleware)
            .concat(bannersApi.middleware)
            .concat(adminBannersApi.middleware)
            .concat(userApi.middleware)
            .concat(orderApi.middleware)
            .concat(paymentApi.middleware)
            .concat(adminOrderApi.middleware)
            .concat(adminPaymentApi.middleware),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define typed hooks
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedDispatch = () => useDispatch<AppDispatch>();