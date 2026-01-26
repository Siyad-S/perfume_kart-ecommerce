"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import ProductCard from "../common/products/product-card";
import { useGetBannersQuery } from "@/src/redux/apis/banners";
import { Skeleton } from "@/src/components/ui/skeleton";
import { ProductCardSkeleton } from "@/src/components/skeletons/product-card-skeleton";
import SectionHeader from "../common/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setFilter } from "@/src/redux/slices/products";
import { useTypedDispatch } from "@/src/redux/store";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function ProductScroller() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const productsRef = useRef<HTMLDivElement>(null);
    const dispatch = useTypedDispatch();
    const router = useRouter();

    const { data: products, isLoading } = useGetProductsQuery({
        search: "",
        skip: 0,
        limit: 3,
        sort: `createdAt_desc`,
        filter: { new_launch: true },
    });

    const { data: banners, isLoading: isBannerLoading } = useGetBannersQuery({
        search: "",
        skip: 0,
        limit: 1,
        sort: `createdAt_desc`,
        filter: { home_sub: true },
    });

    const productsData = products?.data?.data || [];
    const banner = banners?.data?.data?.[0];

    useGSAP(() => {
        // Wait for data to load
        if (isLoading || isBannerLoading) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                }
            });

            // 1. Header Animation
            if (headerRef.current) {
                tl.fromTo(headerRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
                );
            }

            // 2. Banner Animation (Left)
            if (bannerRef.current) {
                tl.fromTo(bannerRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                    "-=0.4"
                );
            }

            // 3. Products Stagger (Right)
            if (productsRef.current && productsRef.current.children.length > 0) {
                tl.fromTo(productsRef.current.children,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
                    "-=0.6"
                );
            }
        });

    }, { scope: containerRef, dependencies: [isLoading, isBannerLoading, productsData, banner] });

    const handleViewAll = () => {
        dispatch(setFilter({ trending: false, best_seller: false, new_launch: true }));
        router.push("/products");
    };

    return (
        <section ref={containerRef} className="px-4 md:px-8 py-16 md:py-24 bg-gray-50/50">
            {/* Title + Show More */}
            <div ref={headerRef} className="">
                <SectionHeader
                    title="New Arrivals"
                    subtitle="Fresh scents just in for you."
                    onViewAll={handleViewAll}
                    actionText="View New Arrivals"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8 items-stretch">
                {/* Left static banner (2 cols on lg) */}
                <div
                    ref={bannerRef}
                    className="relative h-[350px] sm:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl lg:col-span-2 group"
                >
                    {isBannerLoading ? (
                        <Skeleton className="w-full h-full bg-neutral-200" />
                    ) : banner?.banner_url ? (
                        <>
                            <Image
                                src={banner?.banner_url}
                                alt="Collection Banner"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-10">
                                <h3 className="text-white text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4 drop-shadow-md">
                                    {banner.title || "Latest Collection"}
                                </h3>
                                <Button size="lg" className="bg-white text-black text-sm md:text-base border-none hover:bg-gray-200 rounded-full px-6 md:px-8 shadow-lg transition-transform hover:-translate-y-1">
                                    Shop Now
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">No banner available</p>
                        </div>
                    )}
                </div>

                {/* Right product grid (3 cols on lg) */}
                <div
                    ref={productsRef}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:col-span-3"
                >
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-full">
                                <ProductCardSkeleton />
                            </div>
                        ))
                    ) : productsData.length > 0 ? (
                        productsData.map((product: any) => (
                            <div key={product._id} className="product-card translate-y-8">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center text-gray-500 py-20 bg-white rounded-xl border border-dashed">
                            No new arrivals at the moment.
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
}
