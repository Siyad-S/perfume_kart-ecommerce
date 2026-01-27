"use client";

import { useGetUserQuery, useToggleWishlistMutation, useGetWishlistQuery } from "@/src/redux/apis/users";
import { getGuestWishlist, setGuestWishlist, WishlistItemType } from "@/src/utils/guestWishlist";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export interface ProductInput {
    _id: string;
    name: string;
    price: number;
    image_urls: string[];
    [key: string]: any;
}

export const useWishlist = () => {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;
    const { data: wishlistData } = useGetWishlistQuery(user?._id || "", {
        skip: !user?._id,
    });

    const [toggleWishlist, { isLoading: isToggling }] = useToggleWishlistMutation();
    const [guestWishlist, setGuestWishlistState] = useState<WishlistItemType[]>([]);

    useEffect(() => {
        const updateGuestWishlist = () => {
            setGuestWishlistState(getGuestWishlist());
        };
        // Initial fetch
        updateGuestWishlist();
        // Listen for updates
        window.addEventListener("guest-wishlist-updated", updateGuestWishlist);
        return () => {
            window.removeEventListener("guest-wishlist-updated", updateGuestWishlist);
        };
    }, []);

    const isInWishlist = (productId: string) => {
        if (user?._id) {
            return user.wishlist?.some((item: any) => item.product_id === productId || item.product?._id === productId);
        }
        return guestWishlist.some((item) => item.product_id === productId);
    };

    const toggleItem = async (product: ProductInput) => {
        try {
            if (user?._id) {
                const isCurrentlyInWishlist = isInWishlist(product._id);

                await toggleWishlist({
                    id: user._id,
                    productId: product._id
                }).unwrap();

                toast.success(isCurrentlyInWishlist ? "Removed from wishlist" : "Added to wishlist");
            } else {
                const currentWishlist = getGuestWishlist();
                const existingItemIndex = currentWishlist.findIndex(
                    (item) => item.product_id === product._id
                );

                let updatedWishlist: WishlistItemType[];

                if (existingItemIndex > -1) {
                    updatedWishlist = currentWishlist.filter((_, index) => index !== existingItemIndex);
                    toast.success("Removed from wishlist");
                } else {
                    updatedWishlist = [
                        ...currentWishlist,
                        {
                            product_id: product._id,
                            quantity: 1,
                            product: product,
                        },
                    ];
                    toast.success("Added to wishlist");
                }

                setGuestWishlist(updatedWishlist);
                setGuestWishlistState(updatedWishlist);
            }
        } catch (error) {
            console.error("Failed to update wishlist:", error);
            toast.error("Failed to update wishlist");
        }
    };

    return {
        toggleWishlist: toggleItem,
        isInWishlist,
        isToggling,
        wishlistItems: user?._id ? (wishlistData?.data || []) : guestWishlist
    };
};
