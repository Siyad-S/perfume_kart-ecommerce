"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useGetCartQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { useTypedSelector } from "../../../redux/store";
import { CartType } from "@/src/types/user";
import { Minus, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { getGuestCart, setGuestCart, clearGuestCart } from "@/src/utils/guestCart";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;

    const { data, isLoading, isError } = useGetCartQuery(user?._id || "", {
        skip: !isLoggedIn,
    });
    
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
    const [cart, setCart] = useState<CartType[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    // ✅ Load initial cart (user or guest)
    useEffect(() => {
        if (isLoggedIn && data?.data) {
            setCart(data.data);
        } else if (!isLoggedIn) {
            const guestCart = getGuestCart();
            setCart(guestCart);
        }
    }, [isLoggedIn, data]);

    // ✅ Sync quantities state with cart
    useEffect(() => {
        if (cart.length) {
            setQuantities(
                cart.reduce((acc, item) => {
                    acc[item.product_id] = item.quantity;
                    return acc;
                }, {} as Record<string, number>)
            );
        }
    }, [cart]);

    // ✅ Update logic shared for both guest & user
    const updateCart = (updatedCart: CartType[]) => {
        setCart(updatedCart);

        if (isLoggedIn) {
            updateUser({ id: user!._id, updates: { cart: updatedCart } })
                .unwrap()
                .catch(() => toast.error("Failed to update cart"));
        } else {
            setGuestCart(updatedCart);
        }
    };

    const handleIncrement = (id: string) => {
        const newQty = (quantities[id] || 1) + 1;
        const updatedCart = cart.map((item) =>
            item.product_id === id ? { ...item, quantity: newQty } : item
        );
        setQuantities((prev) => ({ ...prev, [id]: newQty }));
        updateCart(updatedCart);
    };

    const handleDecrement = (id: string) => {
        if ((quantities[id] || 1) <= 1) return;
        const newQty = (quantities[id] || 1) - 1;
        const updatedCart = cart.map((item) =>
            item.product_id === id ? { ...item, quantity: newQty } : item
        );
        setQuantities((prev) => ({ ...prev, [id]: newQty }));
        updateCart(updatedCart);
    };

    const handleRemove = (id: string) => {
        const updatedCart = cart.filter((item) => item.product_id !== id);
        const updatedQty = { ...quantities };
        delete updatedQty[id];
        setQuantities(updatedQty);
        updateCart(updatedCart);
    };

    const handleClearCart = () => {
        setCart([]);
        setQuantities({});
        if (isLoggedIn) {
            updateUser({ id: user!._id, updates: { cart: [] } });
        } else {
            clearGuestCart();
        }
    };

    const calculateTotal = () =>
        cart.reduce((sum, item) => {
            const qty = quantities[item.product_id] || item.quantity;
            const price = item.product?.price || 0;
            const discount = item.product?.discount_price || 0;
            return sum + (price - discount) * qty;
        }, 0);

    const handleCheckout = () => {
        router.push("/checkout")
    }

    if (isLoading && isLoggedIn)
        return <p className="p-6 text-center">Loading your cart...</p>;
    if (isError && isLoggedIn)
        return <p className="p-6 text-center text-red-500">Failed to load cart.</p>;
    if (!cart.length)
        return <p className="p-6 text-center">Your cart is empty.</p>;

    return (
        <div className="flex flex-col h-[70vh] p-6">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.map((item) => {
                    const product = item.product;
                    if (!product)
                        return (
                            <div key={item.product_id} className="text-sm text-gray-500">
                                Product details unavailable.
                            </div>
                        );

                    const qty = quantities[item.product_id] || item.quantity;

                    return (
                        <div
                            key={item.product_id}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative">
                                    <Image
                                        src={product.image_urls?.[0] || "/placeholder.jpg"}
                                        alt={product.name || "Product Image"}
                                        fill
                                        className="object-cover rounded-lg border"
                                    />
                                </div>

                                <div>
                                    <h2 className="font-medium">{product.name}</h2>
                                    <p className="text-sm text-gray-600">
                                        ₹{((product.price || 0) - (product.discount_price || 0)).toFixed(2)}
                                    </p>

                                    <div className="flex items-center gap-3 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDecrement(item.product_id)}
                                            disabled={qty <= 1 || updating}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-6 text-center">{qty}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleIncrement(item.product_id)}
                                            disabled={updating}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className="font-semibold">
                                    ₹{((product.price || 0) - (product.discount_price || 0) * qty).toFixed(2)}
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleRemove(item.product_id)}
                                    disabled={updating}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <h2 className="text-xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</h2>
                <div className="flex gap-3">
                    <Button onClick={handleClearCart} variant="outline" disabled={updating}>
                        Clear Cart
                    </Button>
                    <Button onClick={handleCheckout} disabled={updating}>
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
}
