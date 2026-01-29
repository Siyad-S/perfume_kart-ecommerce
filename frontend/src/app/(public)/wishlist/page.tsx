"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/common/products/product-card";
import Breadcrumbs from "@/src/components/common/breadcrumbs";
import { Button } from "@/src/components/ui/button";
import { Loader2, Heart, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWishlist } from "@/src/hooks/useWishlist";

export default function WishlistPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { wishlistItems } = useWishlist();

    const products = useMemo(() => {
        return (wishlistItems || [])
            .map((item: any) => item.product || item)
            .filter((product: any) => !!product);
    }, [wishlistItems]);

    const isLoading = false;
    const isEmpty = products.length === 0;

    useGSAP(
        () => {
            if (isLoading) return;
            const tl = gsap.timeline();

            // Grid Items Animation
            if (!isEmpty) {
                tl.from(".product-card-item", {
                    y: 40,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "back.out(1.2)",
                }, "-=0.3");
            }

            // Empty State Animation
            if (isEmpty) {
                tl.from(".empty-state", {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.out(1.5)"
                });
            }

        },
        { scope: containerRef, dependencies: [isLoading, isEmpty, products.length] }
    );

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-neutral-50/50">
            {/* Sticky Header */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80 support-[backdrop-filter]:bg-white/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight">Wishlist</h1>
                        <div className="hidden md:block h-6 w-px bg-neutral-200"></div>
                        <Breadcrumbs
                            items={[
                                { label: "Home", href: "/home" },
                                { label: "Wishlist" },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Content */}
                {!isEmpty ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {products.map((product: any) => (
                            <div key={product._id} className="product-card-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state flex flex-col items-center justify-center py-20 text-center bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-neutral-300">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-neutral-500 max-w-sm mx-auto mb-8">
                            Looks like you haven't added any items to your wishlist yet.
                            Explore our collection to find your signature scent.
                        </p>
                        <Button asChild className="rounded-full px-8 h-12 bg-black text-white hover:bg-neutral-800">
                            <Link href="/products">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
