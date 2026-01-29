"use client";

import { useEffect, useState, useMemo } from "react";
import { useGetCartQuery } from "@/src/redux/apis/users";
import { useTypedSelector } from "@/src/redux/store";
import { getGuestCart } from "@/src/utils/guestCart";
import { CartType } from "@/src/types/user";

export const useCart = () => {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;
    const [cart, setCart] = useState<CartType[]>([]);

    // Fetch cart data if logged in, else use guest cart
    const {
        data,
        isLoading: isCartLoading,
        isError,
    } = useGetCartQuery(user?._id || "", {
        skip: !isLoggedIn,
    });

    useEffect(() => {
        const updateGuestCart = () => {
            const guestCart = getGuestCart();
            setCart(guestCart);
        };

        if (isLoggedIn) {
            if (data?.data) {
                setCart(data.data);
            }
        } else {
            updateGuestCart();
            window.addEventListener("guest-cart-updated", updateGuestCart);
        }

        return () => {
            window.removeEventListener("guest-cart-updated", updateGuestCart);
        };
    }, [isLoggedIn, data]);

    // Order total calculation
    const subtotal = useMemo(
        () =>
            cart.reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
            ),
        [cart]
    );

    const itemCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const shipping = useMemo(() => {
        if (itemCount === 0) return 0;
        const baseShipping = 40;
        const perItemCharge = 10;
        return baseShipping + Math.max(0, itemCount - 1) * perItemCharge;
    }, [itemCount]);

    const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

    return {
        cart,
        subtotal,
        shipping,
        total,
        isLoading: isCartLoading,
        isError,
    };
};