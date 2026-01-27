"use client";

import { useEffect } from "react";
import { setUser } from "../redux/slices/auth";
import { useTypedDispatch } from "../redux/store";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/apis/users";
import { getGuestCart, clearGuestCart, mergeCarts } from "@/src/utils/guestCart";
import { getGuestWishlist, clearGuestWishlist, mergeWishlists, WishlistItemType } from "@/src/utils/guestWishlist";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { CartType } from "@/src/types/user";

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useTypedDispatch();
    const path = usePathname();
    const isAdmin = path.startsWith("/admin");
    const { data: userData, isSuccess, isLoading } = useGetUserQuery(isAdmin ? "admin/user/me" : "user/me", {
        refetchOnMountOrArgChange: true,
    });
    const user = userData?.data?.user
    const [updateUser] = useUpdateUserMutation();

    useEffect(() => {
        const syncGuestCart = async (user: any) => {
            try {
                const guestCart = getGuestCart();
                if (!guestCart.length) return;

                const userCart: CartType[] = user.cart || [];
                const mergedCart = mergeCarts(userCart, guestCart);

                dispatch(setUser({ ...user, cart: mergedCart }));

                // Update both cart and wishlist if needed, but for now just cart
                // We'll handle wishlist separately or in the same update call if possible
                updateUser({
                    id: user._id,
                    updates: { cart: mergedCart },
                })
                    .unwrap()
                    .then(() => {
                        clearGuestCart();
                        toast.success("Your previous cart items were added successfully!");
                    })
                    .catch((err) => {
                        console.error("Cart merge failed:", err);
                        toast.error("Failed to sync guest cart with your account.");
                    });
            } catch (err) {
                console.error("Cart merge failed:", err);
            }
        };

        const syncGuestWishlist = async (user: any) => {
            try {
                const guestWishlist = getGuestWishlist();
                if (!guestWishlist.length) return;

                const userWishlist: WishlistItemType[] = user.wishlist || [];
                const mergedWishlist = mergeWishlists(userWishlist, guestWishlist);

                // Optimistic update
                dispatch(setUser({ ...user, wishlist: mergedWishlist }));

                updateUser({
                    id: user._id,
                    updates: { wishlist: mergedWishlist },
                })
                    .unwrap()
                    .then(() => {
                        clearGuestWishlist();
                        if (!getGuestCart().length) { // Only show one toast if cart didn't also merge to avoid spam
                            toast.success("Your wishlist items were synced!");
                        }
                    })
                    .catch((err) => {
                        console.error("Wishlist merge failed:", err);
                        // toast.error("Failed to sync guest wishlist."); // Optional: don't annoy user if it fails silently
                    });
            } catch (err) {
                console.error("Wishlist merge failed:", err);
            }
        };

        if (user?._id) {
            dispatch(setUser(user));
            syncGuestCart(user);
            syncGuestWishlist(user);
        } else if (!isLoading && !user) {
            dispatch(setUser(null));
        }
    }, [isSuccess, userData, dispatch, updateUser, isLoading, user]);

    return <>{children}</>;
}
