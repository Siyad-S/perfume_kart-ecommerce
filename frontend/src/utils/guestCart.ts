import { CartType } from "@/src/types/user";
import { safeLocalStorage } from "../lib/safeLocalStorage";

const GUEST_CART_KEY = "guest_cart";

export const getGuestCart = (): CartType[] => {
    return safeLocalStorage.get(GUEST_CART_KEY) || [];
};

export const setGuestCart = (cart: CartType[]) => {
    safeLocalStorage.set(GUEST_CART_KEY, cart);
};

export const clearGuestCart = () => {
    safeLocalStorage.remove(GUEST_CART_KEY);
};

export const mergeCarts = (userCart: CartType[], guestCart: CartType[]): CartType[] => {
    const mergedMap = new Map<string, CartType>();

    [...userCart, ...guestCart].forEach((item) => {
        if (mergedMap.has(item.product_id)) {
            const existing = mergedMap.get(item.product_id)!;
            mergedMap.set(item.product_id, {
                ...existing,
                quantity: existing.quantity + item.quantity,
            });
        } else {
            mergedMap.set(item.product_id, { ...item });
        }
    });

    return Array.from(mergedMap.values());
};
