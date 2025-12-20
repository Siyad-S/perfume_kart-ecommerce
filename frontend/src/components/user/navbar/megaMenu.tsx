"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
// Import the new hook
import { useCategoryNavigation } from "@/src/hooks/useCategoryNavigation";

// --- Types ---
interface Category {
    _id: string;
    name: string;
    image_url: string;
}

interface ProductShort {
    _id: string;
    name: string;
}

interface Brand {
    _id: string;
    name: string;
    products: ProductShort[];
}

interface BestSeller {
    _id: string;
    name: string;
    image_urls: string[];
    price: number;
    discount_price: number;
}

interface MegaMenuProps {
    categories: Category[];
    brands: Brand[];
    bestSellers: BestSeller[];
    isLoading: boolean;
}

export function MegaMenu({ categories, brands, bestSellers, isLoading }: MegaMenuProps) {
    const [showMenu, setShowMenu] = React.useState(false);

    // Use the custom hook
    const { navigateToProducts } = useCategoryNavigation();

    // Helper to create clean URLs for Brands/Perfumes (logic kept for non-category links)
    const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

    const handleCategoryClick = (id: string) => {
        navigateToProducts({ category_id: id });
        setShowMenu(false);
    };

    const handleBrandClick = (id: string) => {
        navigateToProducts({ brand_id: id });
        setShowMenu(false);
    };

    return (
        <div
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            className="h-full flex items-center"
        >
            <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide hover:text-primary transition-colors h-full">
                Perfumes <ChevronDown className="h-4 w-4" />
            </button>

            {showMenu && (
                <div className="absolute left-0 top-full bg-white shadow-2xl border-b border-primary/10 py-10 z-50 w-screen">
                    <div className="container mx-auto px-10">
                        <div className="grid grid-cols-12 gap-10">

                            {/* LEFT: Categories (Using the Hook) */}
                            <div className="col-span-2 border-r pr-8">
                                <h4 className="font-semibold mb-5 text-primary text-lg">
                                    Shop by Category
                                </h4>
                                {isLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading...</div>
                                ) : (
                                    <ul className="space-y-4">
                                        {categories.slice(0, 6).map((cat) => (
                                            <li key={cat._id} className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={cat.image_url}
                                                        alt={cat.name}
                                                        fill
                                                        sizes="32px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                {/* CHANGED: Replaced Link with button/div to use the hook.
                           This ensures Redux state is set before navigating.
                        */}
                                                <button
                                                    onClick={() => handleCategoryClick(cat._id)}
                                                    className="text-sm text-muted-foreground hover:text-primary transition text-left"
                                                >
                                                    {cat.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* CENTER: Brands with perfumes */}
                            <div className="col-span-7 grid grid-cols-3 gap-6">
                                {brands.slice(0, 6).map((brand) => (
                                    <div key={brand._id} className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-primary">{brand.name}</h4>
                                        </div>

                                        <ul className="space-y-2 ml-1">
                                            {brand.products.slice(0, 3).map((perfume) => (
                                                <li key={perfume._id}>
                                                    <Link
                                                        href={`/products/${perfume?._id}`}
                                                        className="text-sm text-muted-foreground hover:text-primary transition block truncate"
                                                    >
                                                        {perfume.name}
                                                    </Link>
                                                </li>
                                            ))}

                                            <li>
                                                <button
                                                    onClick={() => handleBrandClick(brand?._id)}
                                                    className="text-xs font-medium text-primary hover:underline mt-1 block"
                                                >
                                                    View More →
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT: Best Sellers */}
                            <div className="col-span-3">
                                <h4 className="font-semibold mb-5 text-primary text-lg">
                                    Bestsellers
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    {bestSellers.slice(0, 4).map((product) => (
                                        <Link key={product._id} href={`/products/${product?._id}`}>
                                            <div className="group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white border border-gray-100">
                                                <div className="relative h-28 w-full bg-gray-50">
                                                    <Image
                                                        src={product.image_urls[0]}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="p-2">
                                                    <p className="text-xs font-medium truncate text-gray-800">{product.name}</p>
                                                    <p className="text-xs text-primary font-bold mt-1">
                                                        ₹{product.discount_price || product.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}