"use client";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import ProductCard from "../common/products/product-card";
import { ArrowRight } from "lucide-react";
import { ProductGridSkeleton } from "@/src/components/skeletons/product-card-skeleton";
import SectionHeader from "../common/section-header";
import { useRouter } from "next/navigation";

export default function BestSellers() {
    const router = useRouter()
    const { data: products, isLoading } = useGetProductsQuery({
        search: "",
        skip: 0,
        limit: 5,
        sort: `createdAt_desc`,
        filter: { best_seller: true },
    });

    const productsData = products?.data?.data || [];

    const handleAddToCart = (id: string) => {
        // TODO: Add to cart logic
    };

    return (
        <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white dark:bg-black">
            <div className="w-full max-w-7xl mx-auto mb-12">
                <SectionHeader
                    title="Best Sellers"
                    subtitle="Our most popular fragrances loved by everyone."
                    onViewAll={() => { router.push("/products") }}
                    actionText="View All"
                    className="mb-0"
                />
            </div>

            {/* Grid */}
            <div className="w-full max-w-7xl mx-auto">
                {!productsData.length && isLoading ? (
                    <div className="">
                        <ProductGridSkeleton count={5} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {productsData.map((product: any) => (
                            <ProductCard
                                key={product?._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
