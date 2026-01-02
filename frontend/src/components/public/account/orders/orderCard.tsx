"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";

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

    // Status config mapping
    const statusConfig: Record<string, { color: string; icon: any; bg: string }> = {
        pending: { color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
        confirmed: { color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
        shipped: { color: "text-indigo-600", bg: "bg-indigo-50", icon: Truck },
        delivered: { color: "text-emerald-600", bg: "bg-emerald-50", icon: Package },
        cancelled: { color: "text-rose-600", bg: "bg-rose-50", icon: XCircle },
        returned: { color: "text-orange-600", bg: "bg-orange-50", icon: RotateCcw },
    };

    const config = statusConfig[currentStatus] || {
        color: "text-gray-600",
        bg: "bg-gray-50",
        icon: Package
    };
    const StatusIcon = config.icon;

    return (
        <Card className="group overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-xl">
            {/* Header */}
            <div className="bg-gray-50/40 p-5 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100/50">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                    <div className="space-y-0.5">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order Placed</span>
                        <p className="font-medium text-gray-900">
                            {new Date(order_date).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total</span>
                        <p className="font-medium text-gray-900">₹{total_amount.toLocaleString()}</p>
                    </div>
                    {shipping_address && (
                        <div className="space-y-0.5 hidden sm:block">
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ship To</span>
                            <p className="font-medium text-gray-900 truncate max-w-[150px]">
                                {shipping_address.fullName}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 font-mono">#{_id?.slice(-8).toUpperCase()}</p>
                    <Badge
                        variant="secondary"
                        className={cn("px-2.5 py-0.5 text-xs font-semibold capitalize border border-transparent transition-colors", config.bg, config.color)}
                    >
                        <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                        {currentStatus}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Product List Preview */}
                    <div className="flex-1 space-y-4 w-full">
                        {ordered_items?.map((item: any, i: number) => {
                            const { quantity, unit_price, product } = item;
                            return (
                                <div
                                    key={item._id || i}
                                    className="flex gap-4 items-center group/item"
                                >
                                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                        <Image
                                            src={product?.image_urls?.[0]}
                                            alt={product?.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-medium text-gray-900 truncate pr-2">{product?.name}</h4>
                                            <p className="font-medium text-gray-900 whitespace-nowrap text-sm">₹{unit_price?.toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product?.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">Qty: {quantity}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="w-full sm:w-auto flex sm:flex-col gap-3 sm:pl-6 sm:border-l border-gray-100 min-w-[140px]">
                        {!["cancelled", "delivered", "returned"].includes(currentStatus) && (
                            <>
                                <Button
                                    className="w-full bg-black hover:bg-gray-900 text-white rounded-lg h-9 text-sm shadow-sm hover:shadow transition-all"
                                    onClick={onTrack}
                                >
                                    Track Order
                                </Button>
                                {currentStatus === "pending" && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-100 rounded-lg h-9 text-sm"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </>
                        )}
                        {["delivered", "cancelled", "returned"].includes(currentStatus) && (
                            <Button
                                variant="outline"
                                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-9 text-sm"
                                onClick={onTrack}
                            >
                                View Details
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
