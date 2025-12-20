import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { safeLocalStorage } from "./safeLocalStorage";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
    if ("status" in error) {
        if (error.data && typeof error.data === "object" && "message" in error.data) {
            return (error.data as { message: string }).message;
        }
        return `Error ${error.status}`;
    }
    return error.message || "Something went wrong";
};

export const addToGuestCart = (product: any) => {
    const cart = safeLocalStorage.get("cart") || [];
    const existing = cart.find((item: any) => item._id === product._id);

    let updatedCart;
    if (existing) {
        updatedCart = cart.map((item: any) =>
            item._id === product._id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
        );
    } else {
        updatedCart = [...cart, product];
    }

    safeLocalStorage.set("cart", updatedCart);
    return updatedCart;
};