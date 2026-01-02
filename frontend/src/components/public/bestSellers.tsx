"use client";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import ProductCard from "../common/products/product-card";
import { ArrowRight } from "lucide-react";
import { ProductGridSkeleton } from "@/src/components/skeletons/product-card-skeleton";
import SectionHeader from "../common/section-header";

export default function BestSellers() {
    const { data: products, isLoading } = useGetProductsQuery({
        search: "",
        skip: 0,
        limit: 5,
        sort: `created_at_desc`,
        filter: { best_seller: true },
    });

    const productsData = products?.data?.data || [];

    const handleAddToCart = (id: string) => {
        // TODO: Add to cart logic
    };

    return (
        <section className="relative py-10">
            <SectionHeader
                title="Best Sellers"
                subtitle="Our most popular fragrances loved by everyone."
                onViewAll={() => { }} // Placeholder or real nav
                actionText="Shop Best Sellers"
                className="px-4 md:px-8"
            />

            {/* Grid */}
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
