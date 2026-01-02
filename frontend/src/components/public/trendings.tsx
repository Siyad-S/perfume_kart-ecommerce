"use client";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import ProductCard from "../common/products/product-card";
import { ArrowRight } from "lucide-react";
import { ProductGridSkeleton } from "@/src/components/skeletons/product-card-skeleton";
import SectionHeader from "../common/section-header";

export default function Trendings() {
    const { data: products, isLoading } = useGetProductsQuery({
        search: "",
        skip: 0,
        limit: 5, // show 3 trending items initially
        sort: `created_at_desc`,
        filter: {
            trending: true,
        },
    });

    const productsData = products?.data?.data || [];

    const handleAddToCart = (id: string) => {
        // TODO: Add to cart logic
    };

    return (
        <section className="relative py-10">
            {/* Title + Show More */}
            <SectionHeader
                title="Trending Now"
                subtitle="Discover what's hot this season."
                onViewAll={() => { }}
                actionText="Explore Trends"
                className="px-4 md:px-8"
            />

            {/* Responsive Grid */}
            {!productsData.length && isLoading ? (
                <div className="">
                    <ProductGridSkeleton count={5} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-8">
                    {productsData.map((product: any) => (
                        <ProductCard
                            key={product?._id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
