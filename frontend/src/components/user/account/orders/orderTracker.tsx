"use client";

import { CheckCircle2, Package, Truck, Home, Clock } from "lucide-react";

export function OrderTracker({
    status,
    orderDate,
    small = false,
}: {
    status: string;
    orderDate: string;
    small?: boolean;
}) {
    const baseDate = new Date(orderDate);
    const addDays = (days: number) =>
        new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

    // Step list with matching icons
    const steps = [
        { label: "Order Placed", date: addDays(0), icon: Clock },
        { label: "Packed", date: addDays(1), icon: Package },
        { label: "Shipped", date: addDays(2), icon: Truck },
        { label: "Out for Delivery", date: addDays(3), icon: Truck },
        { label: "Delivered", date: addDays(4), icon: Home },
    ];

    // Match order statuses to steps
    const statusOrder = [
        "pending",
        "processing",
        "shipped",
        "out",
        "delivered",
        "cancelled",
    ];
    const currentStep = statusOrder.indexOf(status.toLowerCase());

    const getIconColor = (i: number) => {
        if (status.toLowerCase() === "cancelled") return "text-rose-500 bg-rose-100";
        return i <= currentStep ? "text-indigo-700 bg-indigo-100" : "text-gray-400 bg-gray-100";
    };

    return (
        <div
            className={`relative border-l border-gray-200 pl-6 space-y-5 ${small ? "text-sm" : "text-base"
                }`}
        >
            {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i <= currentStep;
                const iconColor = getIconColor(i);

                return (
                    <div key={i} className="relative flex items-start gap-3">
                        {/* Line Connector */}
                        {i !== steps.length - 1 && (
                            <div
                                className={`absolute left-[10px] top-6 h-full w-[2px] ${isActive ? "bg-indigo-200" : "bg-gray-200"
                                    }`}
                            ></div>
                        )}

                        {/* Step Icon */}
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full ${iconColor}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </div>

                        {/* Step Content */}
                        <div>
                            <p
                                className={`font-medium ${isActive ? "text-gray-800" : "text-gray-500"
                                    }`}
                            >
                                {step.label}
                            </p>
                            <p className="text-xs text-gray-400">
                                {step.date.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                );
            })}

            {/* Cancelled State */}
            {status.toLowerCase() === "cancelled" && (
                <div className="mt-3 ml-1 flex items-start gap-3">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-100 text-rose-500">
                        ✖
                    </div>
                    <div>
                        <p className="font-medium text-rose-600">Order Cancelled</p>
                        <p className="text-xs text-gray-400">
                            {baseDate.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
