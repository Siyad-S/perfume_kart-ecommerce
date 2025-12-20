"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { useGlobalSearchQuery } from "@/src/redux/apis/products"
import { useInfiniteScrollPagination } from "@/src/hooks/useInfiniteScrollPagination"
import Link from "next/link"

interface Brand {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_urls: string[];
    brand: Brand;
    category: Category;
}

export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const searchRef = React.useRef<HTMLDivElement>(null)

    // 1. Setup Pagination Hook
    const {
        list: products,
        hasMore,
        isFetching,
        isLoading: isInitialLoading,
        observerRef,
        reset,
    } = useInfiniteScrollPagination<Product>({
        useQueryHook: useGlobalSearchQuery as any,
        limit: 10,
        search: debouncedQuery,
    })

    // 2. Handle Debouncing and Resetting
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)

        // If user changes input, we should probably reset the list 
        // immediately so old results don't linger while waiting for debounce
        if (query !== debouncedQuery) {
            // Optional: You can choose to reset here or wait for the new fetch
            // reset(); 
        }

        return () => clearTimeout(handler)
    }, [query])

    // Reset list when the actual search term changes (after debounce)
    React.useEffect(() => {
        reset();
    }, [debouncedQuery, reset]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query) return
        setIsOpen(false)
        console.log("Navigating to full search results for:", query)
    }

    const handleProductClick = (productId: string) => {
        console.log("Navigating to product page ID:", productId)
        setIsOpen(false)
        setQuery("")
    }

    const clearSearch = () => {
        setQuery("")
        setDebouncedQuery("")
        reset() // Clear the list
        setIsOpen(false)
    }

    // Click outside to close
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const showLoading = isInitialLoading || (isFetching && products.length === 0);

    return (
        <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Search perfumes, brands..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIsOpen(true)
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="rounded-full pr-10"
                    />
                    {query && (
                        <Button
                            type="button"
                            onClick={clearSearch}
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <Button type="submit" variant="secondary" size="icon" className="rounded-full shrink-0">
                    {showLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
            </form>

            {isOpen && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-xl z-50 overflow-hidden flex flex-col">
                    {(products.length > 0 || isFetching) ? (
                        <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                                Products
                            </div>

                            {/* 3. Infinite Scroll Container */}
                            <ul className="max-h-[300px] overflow-y-auto py-1 custom-scrollbar">
                                {products?.map((product, index) => (
                                    <li key={`${product._id}-${index}`}>
                                        <Link href={`/products/${product?._id}`}>
                                            <button
                                                onClick={() => handleProductClick(product._id)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-4 transition-colors group hover:cursor-pointer"
                                            >
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                                                    <img
                                                        src={product.image_urls?.[0] || "/placeholder-perfume.png"}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-gray-900 truncate group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {product.brand?.name} • {product.category?.name}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    {product.discount_price ? (
                                                        <>
                                                            <span className="block text-xs text-gray-400 line-through">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className="block text-sm font-medium text-primary">
                                                                ₹{product.discount_price}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm font-medium text-primary shrink-0">
                                                            ₹{product.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        </Link>
                                    </li>
                                ))}

                                {/* 4. Observer Element (Triggers next page fetch) */}
                                <div ref={observerRef} className="flex justify-center py-2 h-10 w-full">
                                    {isFetching && products.length > 0 && (
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    )}
                                    {!hasMore && products.length > 0 && (
                                        <span className="text-xs text-gray-400">No more results</span>
                                    )}
                                </div>
                            </ul>
                        </>
                    ) : (
                        !showLoading && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No perfumes found for "{query}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}