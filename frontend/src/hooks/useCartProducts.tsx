"use client";

import { useGetUserQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { CartType } from "@/src/types/user"; // Ensure this path matches your project
import { getGuestCart, setGuestCart } from "@/src/utils/guestCart"; // Ensure this path matches
import { toast } from "sonner";

export interface ProductInput {
    _id: string;
    name: string;
    price: number;
    image_urls: string[];
}

export const useCart = () => {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const addToCart = async (product: ProductInput, quantity: number = 1) => {
        try {
            if (user?._id) {
                // -----------------------------
                // ✅ Logged-in User Logic
                // -----------------------------
                const currentCart = user.cart || [];
                const existingItemIndex = currentCart.findIndex(
                    (item: CartType) => item.product_id === product._id
                );

                let updatedCart: CartType[];

                if (existingItemIndex > -1) {
                    // Update existing item quantity
                    updatedCart = currentCart.map((item: CartType, index: number) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    // Add new item
                    updatedCart = [
                        ...currentCart,
                        { product_id: product._id, quantity: quantity },
                    ];
                }

                await updateUser({
                    id: user._id,
                    updates: { cart: updatedCart },
                }).unwrap();

                toast.success("Added to cart successfully!");
            } else {
                // -----------------------------
                // 🚫 Guest User Logic
                // -----------------------------
                const guestCart = getGuestCart();
                const existingItemIndex = guestCart.findIndex(
                    (item: CartType) => item.product_id === product._id
                );

                let updatedCart: CartType[];

                if (existingItemIndex > -1) {
                    updatedCart = guestCart.map((item: CartType, index: number) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    updatedCart = [
                        ...guestCart,
                        {
                            product_id: product._id,
                            quantity: quantity,
                            // Store full product details for guest display
                            product: {
                                _id: product._id,
                                name: product.name,
                                price: product.price,
                                image_urls: product.image_urls,
                            },
                        },
                    ];
                }

                setGuestCart(updatedCart);
                toast.success("Added to cart successfully!");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    return { addToCart, isUpdating };
};