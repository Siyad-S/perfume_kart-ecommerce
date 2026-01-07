"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/common/products/product-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import { Loader2, Heart, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeader from "@/src/components/common/section-header";
import { useWishlist } from "@/src/hooks/useWishlist";

export default function WishlistPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { wishlistItems } = useWishlist();

    const products = useMemo(() => {
        return (wishlistItems || [])
            .map((item: any) => item.product || item)
            .filter((product: any) => !!product);
    }, [wishlistItems]);

    const isLoading = false; // Guest/Local is instant. If we want global loading, we can add it to hook.
    const isEmpty = products.length === 0;

    useGSAP(
        () => {
            if (isLoading) return;
            const tl = gsap.timeline();

            // Header Animation
            tl.from(".wishlist-header", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            });

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
        <div ref={containerRef} className="container mx-auto px-4 py-8 min-h-screen">
            {/* Breadcrumb */}
            <div className="mb-8 wishlist-header">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/home">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Wishlist</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Page Header */}
            <div className="wishlist-header">
                <SectionHeader
                    title="My Wishlist"
                    subtitle={products.length > 0 ? `You have ${products.length} items in your wishlist` : "Manage your favourite items"}
                    className="mb-10"
                />
            </div>

            {/* Content */}
            {!isEmpty ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
    );
}
