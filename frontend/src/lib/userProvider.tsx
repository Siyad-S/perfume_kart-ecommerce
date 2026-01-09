"use client";

import { useEffect } from "react";
import { setUser } from "../redux/slices/auth";
import { useTypedDispatch } from "../redux/store";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/apis/users";
import { getGuestCart, clearGuestCart, mergeCarts } from "@/src/utils/guestCart";
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

        if (user?._id) {
            dispatch(setUser(user));

            if (user?._id) {
                syncGuestCart(user);
            }
        } else if (!isLoading && !user) {
            dispatch(setUser(null));
        }
    }, [isSuccess, userData, dispatch, updateUser, isLoading, user]);

    return <>{children}</>;
}
