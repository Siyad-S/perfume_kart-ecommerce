"use client";

import { CheckCircle2, Package, Truck, Home, Clock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export function OrderTracker({
    status,
    orderDate,
    small = false,
}: {
    status: string;
    orderDate: string;
    small?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
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

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Animate icons popping in
        tl.from(".tracker-icon", {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1
        })
            // Animate text sliding in
            .from(".tracker-content", {
                x: -10,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1
            }, "-=0.3")
            // Animate connector lines growing
            .from(".tracker-line-active", {
                height: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "power1.inOut"
            }, "-=0.5");

    }, { scope: containerRef });

    const getIconColor = (i: number) => {
        if (status.toLowerCase() === "cancelled") return "text-rose-500 bg-rose-100 border-rose-200";
        return i <= currentStep
            ? "text-indigo-600 bg-indigo-50 border-indigo-200 shadow-sm shadow-indigo-100"
            : "text-gray-300 bg-gray-50 border-gray-100";
    };

    return (
        <div
            ref={containerRef}
            className={`relative pl-2 space-y-0 ${small ? "text-sm" : "text-base"}`}
        >
            {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i <= currentStep;
                const iconColor = getIconColor(i);
                const isLast = i === steps.length - 1;

                return (
                    <div key={i} className="relative flex items-stretch gap-4 pb-8 last:pb-0">
                        {/* Line Connector */}
                        {!isLast && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gray-100 z-0">
                                <div
                                    className={`tracker-line-active w-full bg-indigo-500 transition-all origin-top ${isActive && i < currentStep ? "h-full" : "h-0"}`}
                                />
                            </div>
                        )}

                        {/* Step Icon */}
                        <div
                            className={`tracker-icon relative z-10 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border ${iconColor} transition-all duration-300`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </div>

                        {/* Step Content */}
                        <div className="tracker-content pt-0.5">
                            <p
                                className={`font-medium leading-none ${isActive ? "text-gray-900" : "text-gray-400"}`}
                            >
                                {step.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-1.5 font-medium">
                                {step.date.toLocaleDateString("en-US", {
                                    day: "numeric",
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
                <div className="mt-8 relative flex items-start gap-4 tracker-content">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-100 text-rose-500 border border-rose-200 z-10">
                        <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="font-medium text-rose-600 leading-none">Order Cancelled</p>
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">
                            {baseDate.toLocaleDateString("en-US", {
                                day: "numeric",
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

// Helper for Cancelled Icon if usage needed, currently inlined above
import { XCircle } from "lucide-react";
