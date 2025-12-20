"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/src/components/common/products/product-card";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/src/components/ui/pagination";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { ProductSort } from "@/src/redux/apis/products";
import Categories from "@/src/components/user/categories";
import Breadcrumbs from "@/src/components/common/breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

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
import { Filter } from "lucide-react";
import { useGetBrandsQuery } from "@/src/redux/apis/brands";
import { useGetUserQuery, useUpdateUserMutation } from "@/src/redux/apis/users";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("created_at_desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 0]);

    const limit = 8;
    const category = useSelector((state: RootState) => state.categories.category);
    const brand = useSelector((state: RootState) => state.brands.brand);

    // Example brands (could come from API)
    const { data: brands, isLoading, refetch } = useGetBrandsQuery({
        search: "",
        skip: null,
        limit: null,
        sort: `name_asc`,
    });

    // call API with filters
    const { data: products } = useGetProductsQuery({
        search,
        skip: (currentPage - 1) * limit,
        limit,
        sort: sort as ProductSort,
        filter: {
            ...(brand ? { brand_id: brand } : {}),
            ...(category ? { category_id: category } : {}),
            ...(selectedBrands.length ? { brand: selectedBrands } : {}),
            ...(priceRange[1] > priceRange[0] ? { price: { min: priceRange[0], max: priceRange[1] } } : {}),
        },
    });

    const productsData = products?.data?.data || [];
    const total = products?.data?.totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    // reset to page 1 when search/sort/filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sort, selectedBrands, priceRange]);

    return (
        <div className="p-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/home" },
                        { label: "Products", href: "/products" },
                    ]}
                />
            </div>

            {/* Categories Section */}
            <Categories />

            {/* Header Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-12 mb-6">
                <h1 className="text-2xl font-bold">Our Collection</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:w-[250px]"
                    />

                    {/* Sort Select + Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <Select value={sort} onValueChange={(value) => setSort(value)}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at_desc">Newest to Oldest</SelectItem>
                                <SelectItem value="created_at_asc">Oldest to Newest</SelectItem>
                                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 border rounded-lg hover:bg-muted">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-4 space-y-4">
                                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Brand Filter */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Brands</h3>
                                    <div className="space-y-2">
                                        {brands?.data?.data?.map((brand: any) => (
                                            <div
                                                key={brand?._id}
                                                className="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    checked={selectedBrands.includes(brand?._id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedBrands([
                                                                ...selectedBrands,
                                                                brand?._id,
                                                            ]);
                                                        } else {
                                                            setSelectedBrands(
                                                                selectedBrands.filter(
                                                                    (b) => b !== brand?._id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm">{brand?.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <DropdownMenuSeparator />

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Price Range</h3>
                                    <Slider
                                        value={priceRange}
                                        min={0}
                                        max={100000}
                                        step={1000}
                                        onValueChange={setPriceRange}
                                    />
                                    <div className="flex justify-between text-xs mt-2">
                                        <span>₹{priceRange[0]}</span>
                                        <span>₹{priceRange[1]}</span>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8">
                {productsData.map((product: any) => (
                    <ProductCard
                        key={product?._id}
                        {...product}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        size="icon"
                                        isActive={currentPage === i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage < totalPages
                                                ? currentPage + 1
                                                : totalPages
                                        )
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
