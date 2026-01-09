"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import gsap from "gsap";

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!orderId) {
            router.replace("/home");
        }
    }, [orderId]);
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (containerRef.current && iconRef.current && contentRef.current) {
            tl.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 }
            )
                .fromTo(
                    iconRef.current,
                    { scale: 0, rotation: -45 },
                    { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                    "-=0.4"
                )
                .fromTo(
                    contentRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
                    "-=0.4"
                );
        }
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4">
            <div
                ref={containerRef}
                className="w-full max-w-md text-center"
            >
                <div ref={iconRef} className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                        <CheckCircle className="relative w-24 h-24 text-green-500 fill-green-500/10" />
                    </div>
                </div>

                <div ref={contentRef} className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-display">
                            Order Confirmed!
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Thank you for your purchase. We've received your order and will begin processing it right away.
                        </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Order Reference</p>
                        <p className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-200 tracking-wider">
                            #{orderId}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            onClick={() => router.push("/account/orders")}
                            className="w-full h-12 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors group"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            View My Orders
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/home")}
                            className="w-full h-12 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-medium group"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
