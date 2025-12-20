"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Separator } from "@/src/components/ui/separator";
import { OrderTracker } from "./orderTracker";
import { Badge } from "@/src/components/ui/badge";

export function OrderDetailsModal({
    order,
    onClose,
}: {
    order: any;
    onClose: () => void;
}) {
    if (!order) return null;

    const {
        _id,
        order_date,
        ordered_items,
        total_amount,
        shipping_address,
        status,
    } = order;

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    const statusColors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-blue-100 text-blue-700",
        shipped: "bg-indigo-100 text-indigo-700",
        delivered: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-rose-100 text-rose-700",
        returned: "bg-orange-100 text-orange-700",
    };

    const statusColor = statusColors[status] || "bg-gray-100 text-gray-700";

    return (
        <Dialog open={!!order} onOpenChange={onClose}>
            <DialogContent
                className="
          max-w-2xl w-full
          p-0 
          overflow-hidden 
          rounded-2xl 
          shadow-lg 
          bg-white
          max-h-[85vh] 
          flex flex-col
        "
            >
                {/* Header */}
                <div className="p-5 border-b bg-white flex items-center justify-between">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">
                            Order #{_id?.slice(-6)}
                        </DialogTitle>
                        <p className="text-sm text-gray-500">
                            Placed on {formatDate(order_date)}
                        </p>
                    </DialogHeader>
                    <Badge
                        className={`capitalize ${statusColor} px-3 py-1 rounded-full text-xs font-medium`}
                    >
                        {status}
                    </Badge>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
                    {/* LEFT COLUMN — Items Ordered */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>

                        <div className="space-y-4">
                            {ordered_items?.map((item: any, i: number) => {
                                const { product, quantity, unit_price } = item;
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={product?.image_urls?.[0]}
                                                    alt={product?.name}
                                                    fill
                                                    className="rounded-md object-cover border border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {product?.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {quantity} × ₹{unit_price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            ₹{(quantity * unit_price).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <Separator className="my-5" />

                        {/* Totals */}
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-medium">FREE</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span className="text-indigo-700">
                                    ₹{total_amount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN — Shipping Address + Tracking */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Shipping Address
                            </h3>
                            <div className="text-sm text-gray-700 leading-6">
                                <p>{shipping_address?.fullName}</p>
                                <p>{shipping_address?.street}</p>
                                <p>
                                    {shipping_address?.city}, {shipping_address?.state}{" "}
                                    {shipping_address?.postal_code}
                                </p>
                                <p>{shipping_address?.country}</p>
                                <p className="text-gray-500 mt-1">
                                    Phone: {shipping_address?.phone}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Tracking History */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Tracking History
                            </h3>
                            <OrderTracker status={status} orderDate={order_date} small={true} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-all"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
