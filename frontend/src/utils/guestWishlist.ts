import { safeLocalStorage } from "../lib/safeLocalStorage";

export interface WishlistItemType {
    product_id: string;
    quantity: number;
    product?: any;
}

const GUEST_WISHLIST_KEY = "guest_wishlist";

export const getGuestWishlist = (): WishlistItemType[] => {
    return safeLocalStorage.get(GUEST_WISHLIST_KEY) || [];
};

export const setGuestWishlist = (wishlist: WishlistItemType[]) => {
    safeLocalStorage.set(GUEST_WISHLIST_KEY, wishlist);
    window.dispatchEvent(new Event("guest-wishlist-updated"));
};

export const clearGuestWishlist = () => {
    safeLocalStorage.remove(GUEST_WISHLIST_KEY);
};
