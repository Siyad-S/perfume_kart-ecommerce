"use client";

import { useInfiniteScrollPagination } from "@/src/hooks/useInfiniteScrollPagination";
import {
    useGetOrdersQuery,
    useUpdateOrderMutation,
} from "@/src/redux/apis/orders";
import { OrderCard } from "@/src/components/public/account/orders/orderCard";
import { OrderDetailsModal } from "@/src/components/public/account/orders/orderDetailsModal";
import { ConfirmationModal } from "@/src/components/common/confirmationModal";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ShoppingBag } from "lucide-react";

interface Order {
    _id: string;
    [key: string]: any;
}

export default function OrdersPage() {
    const limit = 5;
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        list: ordersList,
        hasMore,
        isFetching,
        isLoading,
        observerRef,
        containerRef: infiniteScrollRef, // Keeping this if needed for internal logic, but usually attached to a div
        reset,
    } = useInfiniteScrollPagination<Order>({
        useQueryHook: useGetOrdersQuery as any,
        limit,
    });

    const [updateOrder, { isLoading: updateLoading }] = useUpdateOrderMutation();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [targetOrderId, setTargetOrderId] = useState<string | undefined>(undefined);

    const handleCancelOrder = async () => {
        if (!targetOrderId) return;

        try {
            await updateOrder({ id: targetOrderId, status: "cancelled" }).unwrap();

            reset();

            toast.success("Order cancelled successfully");
            setConfirmModalOpen(false);
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError)}`);
        }
    };

    useGSAP(() => {
        if (ordersList.length > 0) {
            gsap.from(".order-card-item", {
                y: 20,
                opacity: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: "power2.out",
                clearProps: "all"
            });
        }
    }, { scope: containerRef, dependencies: [ordersList.length] });

    const noOrders = !isLoading && !isFetching && ordersList.length === 0;

    return (
        <div className="w-full" ref={containerRef}>
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-1">Track and manage your recent purchases.</p>
            </div>

            {isLoading && ordersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : noOrders ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 max-w-sm mt-2">
                        Looks like you haven't placed any orders yet. Start shopping to fill this page!
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {ordersList.map((order, index) => (
                            <div key={order._id || index} className="order-card-item">
                                <OrderCard
                                    order={order}
                                    onTrack={() => setSelectedOrder(order)}
                                    onCancel={() => {
                                        setTargetOrderId(order._id);
                                        setConfirmModalOpen(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div ref={observerRef} className="h-20 flex justify-center items-center">
                        {isFetching && ordersList.length > 0 && (
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        )}
                        {!hasMore && !isFetching && ordersList.length > 0 && (
                            <span className="text-gray-400 text-sm">You've reached the end</span>
                        )}
                    </div>
                </>
            )}

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            <ConfirmationModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                description="Are you sure you want to cancel this order? This action cannot be undone."
                confirmText="Yes, Cancel Order"
                cancelText="No, Keep It"
                loadingText={updateLoading ? "Cancelling..." : "Cancelling..."}
                confirmVariant="destructive"
                targetLabel="Order ID"
                targetValue={targetOrderId}
            />
        </div>
    );
}
