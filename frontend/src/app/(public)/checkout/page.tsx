"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useGetCartQuery } from "@/src/redux/apis/users";
import { useTypedSelector } from "@/src/redux/store";
import { getGuestCart } from "@/src/utils/guestCart";
import { CartType } from "@/src/types/user";
import AddressSection from "@/src/components/public/checkout/addressSection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/src/redux/apis/orders";
import { useVerifyPaymentMutation } from "@/src/redux/apis/payments";
import { ShieldCheck, Truck, CreditCard, Lock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Declare Razorpay type to fix TypeScript error
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
        razorpay_payment_method: string;
    }) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    notes?: Record<string, any>;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface ShippingAddressType {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
}

export default function CheckoutPage() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;
    const [cart, setCart] = useState<CartType[]>([]);
    const router = useRouter();
    const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
    const [verifyPayment, { isLoading: isVerifyLoading }] = useVerifyPaymentMutation();
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch cart data if logged in, else use guest cart
    const { data } = useGetCartQuery(user?._id || "", {
        skip: !isLoggedIn,
    });

    useEffect(() => {
        if (isLoggedIn && data?.data) {
            setCart(data.data);
        } else if (!isLoggedIn) {
            const guestCart = getGuestCart();
            setCart(guestCart);
        }
    }, [isLoggedIn, data]);

    // Address state
    const [selectedAddress, setSelectedAddress] = useState({} as ShippingAddressType);

    // Order total calculation
    const subtotal = cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );
    const baseShipping = cart?.length > 0 ? 40 : 0;
    const perItemCharge = 10;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = baseShipping + (itemCount - 1) * perItemCharge;
    const total = subtotal + shipping;

    // GSAP Animation
    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Title Fade In
        tl.fromTo(".checkout-title",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
            // 2. Left Column (Address)
            .fromTo(".checkout-left",
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            )
            // 3. Right Column (Summary)
            .fromTo(".checkout-right",
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            );
    }, { scope: containerRef });

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        try {
            // 1️⃣ Validate address
            if (!selectedAddress.fullName || !selectedAddress.street) {
                toast.error("Please provide a valid shipping address.");
                return;
            }

            // 2️⃣ Create order on backend
            const orderPayload = {
                user_id: user?._id || "",
                total_amount: total,
                status: "pending",
                shipping_address: selectedAddress,
                ordered_items: cart.map((item) => ({
                    product_id: item.product_id || "",
                    quantity: item.quantity,
                    unit_price:
                        (item?.product?.price || 0) -
                        (item?.product?.discount_price || 0),
                })),
            };

            const { data: responseData }: any = await createOrder(orderPayload).unwrap();
            const order = responseData?.order;
            const payment = responseData?.payment;

            if (!order?._id || !payment?.razorpay?.order_id) {
                toast.error("Order creation failed!");
                return;
            }

            // 3️⃣ Load Razorpay SDK
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Please refresh and try again.");
                return;
            }

            // 4️⃣ Configure Razorpay options
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
                amount: total * 100,
                currency: "INR",
                name: "Fragrance Kart",
                description: "Order Payment",
                order_id: payment.razorpay.order_id,

                handler: async (response: any) => {
                    try {
                        const verifyRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order._id,
                            payment_id: payment._id,
                            payment_method: "razorpay",
                            payment_status: "completed",
                        }).unwrap();

                        const paymentData = verifyRes?.data;
                        if (paymentData?.payment_status === "completed") {
                            router.push(`/order-success/${order._id}`);
                        }
                    } catch (error) {
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },

                prefill: {
                    name: selectedAddress.fullName,
                    email: user?.email || "",
                    contact: selectedAddress.phone,
                },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled or failed.");
                    },
                },
            } as any;

            // 6️⃣ Initialize Razorpay instance
            const rzp = new window.Razorpay(options);

            // 7️⃣ Explicitly handle failed transactions
            rzp.on("payment.failed", async (response: any) => {
                console.log("Payment failed:", response.error);
                toast.error("Payment failed: " + response.error.description);
                try {
                    await verifyPayment({
                        razorpay_order_id: response.error.metadata?.order_id,
                        razorpay_payment_id: response.error.metadata?.payment_id,
                        order_id: order._id,
                        payment_id: payment._id,
                        payment_status: "failed",
                        error_reason: response.error.description,
                    }).unwrap();
                } catch (err) {
                    console.log("Failed to update payment status:", err);
                }
                router.push(`/order-failed/${order._id}`);
            });

            // 8️⃣ Open Razorpay modal
            rzp.open();
        } catch (error: any) {
            console.log("Error placing order:", error);
            toast.error("Something went wrong: " + error.message);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => router.push("/products")}>
                    Start Shopping
                </Button>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 py-10 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                <h1 className="checkout-title text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 md:mb-12 text-center md:text-left">
                    Secure Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: Address & Info */}
                    <div className="checkout-left lg:col-span-2 space-y-8">
                        {/* 1. Address Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <AddressSection
                                selectedAddress={selectedAddress}
                                setSelectedAddress={setSelectedAddress}
                            />
                        </div>

                        {/* 2. Payment Info (Static Visual) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 opacity-80">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                            </h3>
                            <div className="p-4 border rounded-xl flex items-center justify-between bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Razorpay Secure</p>
                                        <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Netbanking</p>
                                    </div>
                                </div>
                                <div className="text-primary font-medium text-sm">Selected</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary (Sticky) */}
                    <div className="checkout-right lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 lg:sticky lg:top-32">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Items List (Compact) */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, index) => (
                                    <div key={item.product_id || index} className="flex gap-4 items-start">
                                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <Image
                                                src={item.product?.image_urls?.[0] || "/placeholder.jpg"}
                                                alt={item.product?.name || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{((item.product?.price || 0) * item.quantity).toFixed(0)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 my-6"></div>

                            {/* Totals */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Truck className="w-4 h-4" /> Shipping
                                    </span>
                                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <Button
                                size="lg"
                                className="w-full mt-8 rounded-xl py-6 text-lg font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                disabled={!selectedAddress?.fullName || cart.length === 0 || isOrderLoading || isVerifyLoading}
                                onClick={handlePlaceOrder}
                            >
                                {isOrderLoading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <Lock className="w-3 h-3" />
                                <span>Payments are 256-bit encrypted</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}