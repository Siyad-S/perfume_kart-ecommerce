"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useGetCartQuery } from "@/src/redux/apis/users";
import { useTypedSelector } from "@/src/redux/store";
import { getGuestCart } from "@/src/utils/guestCart";
import { CartType } from "@/src/types/user";
import AddressSection from "@/src/components/user/checkout/addressSection";
import { createOrder } from "@/src/redux/services/order.service";
import { verifyPayment } from "@/src/redux/services/payment.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/src/redux/apis/orders";
import { useVerifyPaymentMutation } from "@/src/redux/apis/payments";

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
        razorpay_payment_id?: string; // Optional for COD
        razorpay_signature?: string; // Optional for COD
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
    notes?: Record<string, any>; // Add notes for COD eligibility
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


    // Fetch cart data if logged in, else use guest cart
    const { data, isLoading, isError } = useGetCartQuery(user?._id || "", {
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



    console.log("selectedAddress", selectedAddress);


    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>

            {/* Order Summary */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <h2 className="text-lg font-semibold">Order Summary</h2>
                    {cart.length > 0 ? (
                        cart.map((item, index: number) => (
                            <div key={item?.product_id || index} className="flex items-center gap-4">
                                <div className="h-[80px] w-[100px] relative">
                                    <Image
                                        src={item.product?.image_urls?.[0] || ""}
                                        alt={item.product?.name || ""}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.product?.name || ""}</p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} × ₹{item.product?.price || 0}
                                    </p>
                                </div>
                                <p className="font-semibold">₹{(item.product?.price || 0) * item.quantity}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Your cart is empty.</p>
                    )}
                    <div className="border-t pt-4 space-y-1 text-right">
                        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                        <p>Shipping: ₹{shipping.toFixed(2)}</p>
                        <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Address Section */}
            <AddressSection
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
            />

            {/* Place Order */}
            <Button
                className="w-full"
                disabled={!selectedAddress?.fullName || cart.length === 0}
                onClick={handlePlaceOrder}
            >
                Place Order
            </Button>
        </div>
    );
}