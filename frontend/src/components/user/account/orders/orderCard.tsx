"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";

interface OrderCardProps {
    order: any;
    onTrack: () => void;
    onCancel?: () => void;
}

export function OrderCard({ order, onTrack, onCancel }: OrderCardProps) {
    const [isCancelled, setIsCancelled] = useState(order.status === "cancelled");

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            const confirmCancel = confirm("Are you sure you want to cancel this order?");
            if (confirmCancel) {
                setIsCancelled(true);
                alert("Order cancelled successfully (simulated)");
            }
        }
    };

    const {
        _id,
        total_amount,
        status,
        ordered_items,
        order_date,
        shipping_address,
    } = order;

    const currentStatus = isCancelled ? "cancelled" : status;

    // ✅ Define color mapping for each status
    const statusColors: Record<string, string> = {
        pending: "text-yellow-600",
        confirmed: "text-blue-600",
        shipped: "text-indigo-600",
        delivered: "text-green-600",
        cancelled: "text-red-600",
        returned: "text-orange-600",
    };

    // ✅ Pick the correct color or fallback
    const statusColor = useMemo(
        () => statusColors[currentStatus] || "text-gray-600",
        [currentStatus]
    );

    return (
        <Card className="p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">Order #{_id?.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                        Ordered on{" "}
                        {new Date(order_date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {shipping_address?.city}, {shipping_address?.state}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-semibold capitalize ${statusColor}`}>
                        {currentStatus}
                    </p>
                </div>
            </div>

            <Separator />

            {/* Product List */}
            <div className="space-y-4">
                {ordered_items?.map((item: any, i: number) => {
                    const { quantity, unit_price, product } = item;
                    return (
                        <div
                            key={item._id || i}
                            className="flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={product?.image_urls?.[0]}
                                        alt={product?.name}
                                        fill
                                        className="rounded-md object-cover border"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">{product?.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-medium">₹{unit_price * quantity}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Separator />

            {/* Footer */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Total Items: {ordered_items?.length}
                </p>
                <div className="flex gap-3 items-center">
                    <p className="font-semibold text-lg">Total: ₹{total_amount}</p>

                    {/* Hide actions if cancelled or delivered */}
                    {!["cancelled", "delivered", "returned", "confirmed"].includes(currentStatus) && (
                        <>
                            <Button size="sm" variant="outline" onClick={onTrack}>
                                Track
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
