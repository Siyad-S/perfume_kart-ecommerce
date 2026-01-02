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
import { MapPin, Phone, User, Package, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export function OrderDetailsModal({
    order,
    onClose,
}: {
    order: any;
    onClose: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (order) {
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

            tl.fromTo(
                ".modal-content-left",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, delay: 0.1 }
            )
                .fromTo(
                    ".modal-content-right",
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.5 },
                    "-=0.4"
                )
                .fromTo(
                    ".order-item",
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 },
                    "-=0.2"
                );
        }
    }, { scope: containerRef, dependencies: [order] });

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
        new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    const statusColors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
        delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cancelled: "bg-rose-100 text-rose-700 border-rose-200",
        returned: "bg-orange-100 text-orange-700 border-orange-200",
    };

    const statusColor = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
        <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl shadow-2xl bg-white focus:outline-none border-0 block outline-none ring-0">
                <div ref={containerRef} className="flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                Order Details
                                <Badge variant="outline" className={`capitalize font-semibold border ${statusColor}`}>
                                    {status}
                                </Badge>
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Order #{_id?.slice(-8).toUpperCase()} • Placed on {formatDate(order_date)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                            {/* LEFT (2/3): Items */}
                            <div className="lg:col-span-2 modal-content-left space-y-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Items Ordered
                                </h3>

                                <div className="space-y-4">
                                    {ordered_items?.map((item: any, i: number) => {
                                        const { product, quantity, unit_price } = item;
                                        return (
                                            <div
                                                key={i}
                                                className="order-item flex gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="relative w-20 h-20 shrink-0 bg-white rounded-lg border border-gray-100 overflow-hidden">
                                                    <Image
                                                        src={product?.image_urls?.[0] || "/placeholder.png"}
                                                        alt={product?.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-medium text-gray-900 line-clamp-1 text-base">
                                                        {product?.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                        {product?.description}
                                                    </p>
                                                </div>
                                                <div className="text-right flex flex-col justify-center min-w-[80px]">
                                                    <p className="font-semibold text-gray-900">
                                                        ₹{(quantity * unit_price).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Qty: {quantity} × ₹{unit_price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5 space-y-3 mt-6">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{total_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 font-medium">Free</span>
                                    </div>
                                    <Separator className="bg-gray-200" />
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{total_amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT (1/3): Info */}
                            <div className="modal-content-right space-y-8">

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                        Order Status
                                    </h3>
                                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                        <OrderTracker status={status} orderDate={order_date} small={true} />
                                    </div>
                                </div>

                                {/* Address */}
                                {shipping_address && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Delivery Address
                                        </h3>
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100/50 text-sm space-y-3 text-gray-600">
                                            <div className="flex items-center gap-2 text-gray-900 font-medium">
                                                <User className="w-3.5 h-3.5" />
                                                {shipping_address.fullName}
                                            </div>
                                            <p className="leading-relaxed pl-5.5">
                                                {shipping_address.street}<br />
                                                {shipping_address.city}, {shipping_address.state}<br />
                                                {shipping_address.postal_code}
                                            </p>
                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100/50 mt-3">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                {shipping_address.phone}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
