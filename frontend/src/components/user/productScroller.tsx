"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import { ArrowRight } from "lucide-react";
import ProductCard from "../common/products/product-card";
import { useGetBannersQuery } from "@/src/redux/apis/banners";

export default function ProductScroller() {
    const { data: products, isLoading } = useGetProductsQuery({
        search: "",
        skip: 0,
        limit: 3,
        sort: `created_at_desc`,
        filter: { new_launch: true },
    });

    const { data: banners, isLoading: isBannerLoading, refetch } = useGetBannersQuery({
        search: "",
        skip: 0,
        limit: 1,
        sort: `created_at_desc`,
    });

    const productsData = products?.data?.data || [];
    const banner = banners?.data?.data?.[0];

    return (
        <section className="px-4 md:px-8 py-8 md:py-12">
            {/* Title + Show More */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-[500] uppercase tracking-wide">
                    New Arrivals
                </h2>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Show More
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                {/* Left static banner (2 cols on lg) */}
                <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-md lg:col-span-2">
                    {banner?.banner_url ? (
                        <Image
                            src={banner?.banner_url}
                            alt="Collection Banner"
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">No sub banner image available</p>
                        </div>
                    )}
                    <div className="absolute bottom-6 left-6">
                        <Button className="bg-[#a5694f] text-white px-6 py-2 rounded-full hover:bg-[#8c543d]">
                            Shop Now
                        </Button>
                    </div>
                </div>

                {/* Right product grid (3 cols on lg) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:col-span-3">
                    {productsData.length > 0 ? (
                        productsData.map((product: any) => (
                            <ProductCard className="h-fit" key={product._id} {...product} />
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center text-gray-500">
                            {isLoading ? "Loading products..." : "No products available."}
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
}
