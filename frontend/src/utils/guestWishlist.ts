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

export const mergeWishlists = (userWishlist: WishlistItemType[], guestWishlist: WishlistItemType[]): WishlistItemType[] => {
    const mergedMap = new Map<string, WishlistItemType>();

    [...userWishlist, ...guestWishlist].forEach((item) => {
        // Use product_id or product._id depending on the structure
        const itemId = item.product_id || (item.product && item.product._id);

        if (itemId && !mergedMap.has(itemId)) {
            mergedMap.set(itemId, { ...item, product_id: itemId });
        }
    });

    return Array.from(mergedMap.values());
};
