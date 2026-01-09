"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "@/src/components/common/products/product-card";
import { ProductGridSkeleton } from "@/src/components/skeletons/product-card-skeleton";
import { useGetProductsQuery, ProductSort } from "@/src/redux/apis/products";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import Categories from "@/src/components/public/categories";
import Breadcrumbs from "@/src/components/common/breadcrumbs";
import { RootState, useTypedDispatch, useTypedSelector } from "@/src/redux/store";
import { setFilter } from "@/src/redux/slices/products";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Slider } from "@/src/components/ui/slider";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Filter, Loader2, Search, PackageSearch, ChevronDown } from "lucide-react";
import { useGetBrandsQuery } from "@/src/redux/apis/brands";
import { setBrand } from "@/src/redux/slices/brands";
import { useInfiniteScrollPagination } from "@/src/hooks/useInfiniteScrollPagination";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/src/components/ui/button";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("createdAt_desc");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

    const containerRef = useRef<HTMLDivElement>(null);

    const { filter: reduxFilters } = useTypedSelector((state) => state.products);
    const { best_seller, trending, new_launch } = reduxFilters;
    const dispatch = useTypedDispatch();

    const category = useTypedSelector((state) => state.categories.category);
    const brand = useTypedSelector((state) => state.brands.brand);

    // Brands Query
    const { data: brands } = useGetBrandsQuery({
        search: "",
        skip: null,
        limit: null,
        sort: `name_asc`,
    });

    useEffect(() => {
        if (brand) {
            setSelectedBrands((prev) => {
                if (prev.includes(brand)) return prev;
                return [...prev, brand];
            });
            dispatch(setBrand(null));
        }
    }, [brand, dispatch]);

    // Prepare filters
    const filters = {
        ...(brand ? { brand_id: brand } : {}),
        ...(category ? { category_id: category } : {}),
        ...(selectedBrands.length ? { brand: selectedBrands } : {}),
        ...(priceRange[1] > priceRange[0] ? { price: { min: priceRange[0], max: priceRange[1] } } : {}),
        ...(best_seller ? { best_seller: true } : {}),
        ...(trending ? { trending: true } : {}),
        ...(new_launch ? { new_launch: true } : {}),
    };

    const isAnyFilterActive =
        !!brand ||
        !!category ||
        selectedBrands.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 100000 ||
        best_seller ||
        trending ||
        new_launch;

    const handleFilterChange = (key: keyof typeof reduxFilters, value: boolean) => {
        dispatch(setFilter({
            ...reduxFilters,
            [key]: value
        }));
    };

    const handleClearFilters = () => {
        setSearch("");
        setSort("createdAt_desc");
        setSelectedBrands([]);
        setPriceRange([0, 100000]);
        dispatch(setFilter({
            best_seller: false,
            trending: false,
            new_launch: false
        }));
        dispatch(setBrand(null));
    };

    // Infinite Scroll Hook
    const {
        list: productsData,
        isFetching,
        hasMore,
        observerRef,
    } = useInfiniteScrollPagination({
        useQueryHook: useGetProductsQuery,
        limit: 12,
        search,
        extraQueryArgs: {
            sort: sort as ProductSort,
            filter: filters,
        },
    });

    // GSAP Animation for initial load and list updates
    useGSAP(() => {
        if (productsData.length > 0 && !isFetching) {
            gsap.fromTo(".product-card-item",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "all" }
            );
        }
    }, { dependencies: [/* productsData.length // Re-animating on length change might be jarring */], scope: containerRef });

    // Better: Animate only on mount or sort change.
    useGSAP(() => {
        gsap.fromTo(".header-animate",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
        );
    }, { scope: containerRef });


    return (
        <div ref={containerRef} className="min-h-screen bg-neutral-50/50">
            {/* Header Section */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80 support-[backdrop-filter]:bg-white/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <h1 className="text-xl font-bold tracking-tight">Shop</h1>
                            <div className="hidden md:block h-6 w-px bg-neutral-200"></div>
                            <Breadcrumbs
                                items={[
                                    { label: "Home", href: "/home" },
                                    { label: "Products", href: "/products" },
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 bg-neutral-100 border-none focus-visible:ring-1 transition-all rounded-full h-10"
                                />
                            </div>

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center justify-between w-[160px] rounded-full border border-neutral-200 h-10 px-3 text-sm bg-white hover:bg-neutral-100 transition-colors">
                                        <span className="truncate">
                                            {sort === "createdAt_desc" && "Newest"}
                                            {sort === "price_asc" && "Price: Low - High"}
                                            {sort === "price_desc" && "Price: High - Low"}
                                            {sort === "name_asc" && "Name: A - Z"}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-neutral-500 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[160px]" align="start">
                                    <DropdownMenuItem onClick={() => setSort("createdAt_desc")}>
                                        Newest
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort("price_asc")}>
                                        Price: Low - High
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort("price_desc")}>
                                        Price: High - Low
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort("name_asc")}>
                                        Name: A - Z
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="relative h-10 w-10 flex items-center justify-center border border-neutral-200 rounded-full hover:bg-neutral-100 transition-colors bg-white">
                                        <Filter className="w-4 h-4 text-neutral-600" />
                                        {(isAnyFilterActive) && (
                                            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-white"></span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72 p-4" align="end">
                                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <div className="py-4 space-y-6">
                                        {/* Price Range */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold">Price Range</h3>
                                                <span className="text-xs text-neutral-500">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                                            </div>

                                            <Slider
                                                value={priceRange}
                                                min={0}
                                                max={100000}
                                                step={1000}
                                                onValueChange={setPriceRange}
                                            />
                                        </div>

                                        {/* Brands */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold">Brands</h3>
                                            <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-neutral-200">
                                                {brands?.data?.data?.map((brand: any) => (
                                                    <div key={brand?._id} className="flex items-center gap-3">
                                                        <Checkbox
                                                            id={`brand-${brand._id}`}
                                                            checked={selectedBrands.includes(brand?._id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedBrands([...selectedBrands, brand?._id]);
                                                                } else {
                                                                    setSelectedBrands(selectedBrands.filter((b) => b !== brand?._id));
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`brand-${brand._id}`} className="text-sm cursor-pointer select-none">
                                                            {brand?.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Special Tags */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold">Special</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="filter-best-seller"
                                                        checked={best_seller}
                                                        onCheckedChange={(checked) => handleFilterChange("best_seller", checked as boolean)}
                                                    />
                                                    <label htmlFor="filter-best-seller" className="text-sm cursor-pointer select-none">
                                                        Best Seller
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="filter-trending"
                                                        checked={trending}
                                                        onCheckedChange={(checked) => handleFilterChange("trending", checked as boolean)}
                                                    />
                                                    <label htmlFor="filter-trending" className="text-sm cursor-pointer select-none">
                                                        Trending
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="filter-new-launch"
                                                        checked={new_launch}
                                                        onCheckedChange={(checked) => handleFilterChange("new_launch", checked as boolean)}
                                                    />
                                                    <label htmlFor="filter-new-launch" className="text-sm cursor-pointer select-none">
                                                        New Launch
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="mb-12 header-animate">
                    <Categories />
                </div>

                <div className="header-animate mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
                    <p className="text-neutral-500">Showing {productsData.length} items</p>
                </div>

                {/* Product Grid */}
                {productsData.length === 0 && isFetching ? (
                    <div className="header-animate">
                        <ProductGridSkeleton count={8} />
                    </div>
                ) : productsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center header-animate">
                        <div className="bg-neutral-100 p-4 rounded-full mb-4">
                            <PackageSearch className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto mb-8">
                            We couldn't find any perfumes matching your current filters. Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <Button
                            onClick={handleClearFilters}
                            variant="outline"
                            className="rounded-full px-6"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                        {productsData.map((product: any, index: number) => (
                            <div key={`${product?._id}-${index}`} className="product-card-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading State & Observer Target */}
                <div
                    ref={observerRef}
                    className="w-full h-20 flex items-center justify-center mt-12 mb-20"
                >
                    {(isFetching || hasMore) && (
                        <div className="flex items-center gap-2 text-neutral-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Loading more...</span>
                        </div>
                    )}
                    {!hasMore && productsData.length > 0 && (
                        <p className="text-neutral-400 text-sm">You've reached the end</p>
                    )}
                </div>
            </div>
        </div>
    );
}
