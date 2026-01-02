"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { useGetCartQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { useTypedSelector } from "../../../redux/store";
import { CartType } from "@/src/types/user";
import { Minus, Plus, Trash, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getGuestCart, setGuestCart, clearGuestCart } from "@/src/utils/guestCart";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Sync quantities state with cart
    useEffect(() => {
        if (isLoggedIn && data?.data) {
            setCart(data.data);
        } else if (!isLoggedIn) {
            const guestCart = getGuestCart();
            setCart(guestCart);
        }
    }, [isLoggedIn, data]);

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

    // GSAP Animation
    useGSAP(() => {
        if (!containerRef.current || cart.length === 0) return;

        const tl = gsap.timeline();

        // 1. Header
        tl.fromTo(".cart-header",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
            // 2. Cart Items (Staggered)
            .fromTo(".cart-item",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
                "-=0.3"
            )
            // 3. Summary Panel (Slide in)
            .fromTo(".cart-summary",
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            );

    }, { scope: containerRef, dependencies: [cart.length > 0] }); // Only run entrance when cart has items

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

    const handleRemove = (id: string, element: Element) => {
        // Animate removal first
        gsap.to(element, {
            x: -50,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                const updatedCart = cart.filter((item) => item.product_id !== id);
                const updatedQty = { ...quantities };
                delete updatedQty[id];
                setQuantities(updatedQty);
                updateCart(updatedCart);
            }
        });
    };

    const handleClearCart = () => {
        if (confirm("Are you sure you want to clear your cart?")) {
            setCart([]);
            setQuantities({});
            if (isLoggedIn) {
                updateUser({ id: user!._id, updates: { cart: [] } });
            } else {
                clearGuestCart();
            }
        }
    };

    const calculateSubtotal = () =>
        cart.reduce((sum, item) => {
            const qty = quantities[item.product_id] || item.quantity;
            const price = item.product?.price || 0;
            const discount = item.product?.discount_price || 0;
            return sum + (price - discount) * qty;
        }, 0);

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 1000 ? 0 : 100; // Example logic: Free shipping over 1000
    const total = subtotal + shipping;

    const handleCheckout = () => {
        router.push("/checkout")
    }

    if (isLoading && isLoggedIn)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );

    if (isError && isLoggedIn)
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-red-500">Failed to load cart.</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );

    // --- EMPTY CART STATE ---
    if (!cart.length)
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Looks like you haven't added anything to your cart yet. Explore our collection to find your signature scent.
                </p>
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <Link href="/products">
                        Start Shopping
                    </Link>
                </Button>
            </div>
        );

    // --- FILLED CART STATE ---
    return (
        <div ref={containerRef} className="bg-gray-50/50 min-h-screen py-10 md:py-20">
            <div className="container mx-auto px-4 md:px-6">

                <div className="cart-header flex items-center justify-between mb-8 opacity-0">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Your Cart ({cart.length})</h1>
                    <Link href="/products" className="hidden md:flex items-center gap-2 text-primary hover:underline font-medium">
                        <ArrowLeft className="w-4 h-4" /> Continue Shopping
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* LEFT: Cart Items List */}
                    <div className="flex-1 w-full space-y-6">
                        {cart.map((item) => {
                            const product = item.product;
                            if (!product) return null;
                            const qty = quantities[item.product_id] || item.quantity;
                            const finalPrice = (product.price || 0) - (product.discount_price || 0);

                            return (
                                <div
                                    key={item.product_id}
                                    id={`item-${item.product_id}`}
                                    className="cart-item group bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 md:gap-8 items-center transition-all hover:shadow-md opacity-0"
                                >
                                    {/* Image */}
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                                        <Image
                                            src={product.image_urls?.[0] || "/placeholder.jpg"}
                                            alt={product.name || "Product"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h2 className="font-serif font-bold text-lg md:text-xl text-gray-900 group-hover:text-primary transition-colors">
                                                <Link href={`/products/${product._id}`}>{product.name}</Link>
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Size: 100ml {/* Example placeholder for variant */}
                                            </p>
                                            <div className="md:hidden font-semibold text-gray-900 mt-1">
                                                ₹{finalPrice.toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Actions: Qty & Remove */}
                                        <div className="flex items-center gap-6">

                                            {/* Qty Control */}
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
                                                <button
                                                    onClick={() => handleDecrement(item.product_id)}
                                                    disabled={qty <= 1 || updating}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-gray-600 hover:text-black disabled:opacity-50 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-4 text-center font-medium text-sm">{qty}</span>
                                                <button
                                                    onClick={() => handleIncrement(item.product_id)}
                                                    disabled={updating}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-gray-600 hover:text-black disabled:opacity-50 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Price (Desktop) */}
                                            <div className="hidden md:block font-bold text-lg text-gray-900 min-w-[80px] text-right">
                                                ₹{(finalPrice * qty).toFixed(2)}
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={(e) => {
                                                    const card = document.getElementById(`item-${item.product_id}`);
                                                    if (card) handleRemove(item.product_id, card);
                                                }}
                                                disabled={updating}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                title="Remove Item"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="cart-item opacity-0 pt-4 flex justify-between">
                            <Button variant="ghost" className="text-gray-500 hover:text-red-500" onClick={handleClearCart}>
                                Clear Cart
                            </Button>
                        </div>
                    </div>


                    {/* RIGHT: Order Summary */}
                    <div className="cart-summary w-full lg:w-[400px] shrink-0 opacity-0">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 lg:sticky lg:top-32">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-4" />
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    *Taxes calculated at checkout
                                </p>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={updating}
                                size="lg"
                                className="w-full rounded-xl py-6 text-lg font-medium shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
                            >
                                Checkout <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Secure Checkout
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
