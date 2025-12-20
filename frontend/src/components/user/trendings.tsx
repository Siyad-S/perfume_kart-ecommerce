"use client";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import ProductCard from "../common/products/product-card";
import { ArrowRight } from "lucide-react";

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
        console.log(`Added product ${id} to cart`);
    };

    return (
        <section className="relative py-10">
            {/* Title + Show More */}
            <div className="flex items-center justify-between px-4 md:px-8 mb-8">
                <h2 className="text-2xl font-[500] uppercase tracking-wide">
                    Trending
                </h2>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Show More
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-8">
                {productsData.map((product: any) => (
                    <ProductCard
                        key={product?._id}
                        {...product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </section>
    );
}
