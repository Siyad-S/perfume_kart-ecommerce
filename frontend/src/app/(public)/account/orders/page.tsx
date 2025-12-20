"use client";

import { useInfiniteScrollPagination } from "@/src/hooks/useInfiniteScrollPagination";
import {
    useGetOrdersQuery,
    useUpdateOrderMutation,
} from "@/src/redux/apis/orders";
import { OrderCard } from "@/src/components/user/account/orders/orderCard";
import { OrderDetailsModal } from "@/src/components/user/account/orders/orderDetailsModal";
import { ConfirmationModal } from "@/src/components/common/confirmationModal";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface Order {
    _id: string;
    [key: string]: any;
}

export default function OrdersPage() {
    const limit = 5;

    const {
        list: ordersList,
        hasMore,
        isFetching,
        isLoading,
        observerRef,
        containerRef,
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

    const noOrders = !isLoading && ordersList.length === 0;

    return (
        <div className="w-full" ref={containerRef}>
            <h1 className="text-xl font-semibold mb-6">My Orders</h1>

            {isLoading && ordersList.length === 0 ? (
                <div className="text-center py-8">Loading orders...</div>
            ) : noOrders ? (
                <div className="text-center text-gray-500 py-10">No orders found</div>
            ) : (
                <>
                    <div className="space-y-6">
                        {ordersList.map((order, index) => (
                            <OrderCard
                                key={order._id || index}
                                order={order}
                                onTrack={() => setSelectedOrder(order)}
                                onCancel={() => {
                                    setTargetOrderId(order._id);
                                    setConfirmModalOpen(true);
                                }}
                            />
                        ))}
                    </div>

                    <div ref={observerRef} className="h-12 flex justify-center items-center">
                        {isFetching && ordersList.length > 0 && <span>Loading more...</span>}
                        {!hasMore && !isFetching && (
                            <span className="text-gray-400 text-sm mt-4">No more orders</span>
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
