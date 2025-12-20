"use client";

import { useRouter } from "next/navigation";
import { useTypedDispatch } from "@/src/redux/store";
import { setCategory } from "@/src/redux/slices/categories";
import { setBrand } from "@/src/redux/slices/brands";

interface NavigateToProductsProps {
    category_id?: string;
    brand_id?: string;
}
export const useCategoryNavigation = () => {
    const dispatch = useTypedDispatch();
    const router = useRouter();

    const navigateToProducts = ({ category_id, brand_id }: NavigateToProductsProps) => {
        if (category_id) dispatch(setCategory(category_id));
        if (brand_id) dispatch(setBrand(brand_id));

        router.push("/products");
    };

    return { navigateToProducts };
};