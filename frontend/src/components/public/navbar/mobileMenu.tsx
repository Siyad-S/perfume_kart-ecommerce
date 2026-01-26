"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image" // Added Image import
import { Search, Heart, ShoppingCart, User, X, ChevronDown, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useGlobalSearchQuery } from "@/src/redux/apis/products"
import { useInfiniteScrollPagination } from "@/src/hooks/useInfiniteScrollPagination"
import { useLogoutMutation } from "@/src/redux/apis/auth";
import { useGetUserQuery, userApi } from "@/src/redux/apis/users";
import { setUser } from "@/src/redux/slices/auth"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { useCategoryNavigation } from "@/src/hooks/useCategoryNavigation"
import { AiScentMatch } from "@/src/components/ai/AiScentMatch"

// Types
interface Category {
    _id: string
    name: string
    image_url?: string
}

interface Brand {
    _id: string
    name: string
    products?: any[]
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

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
    brands: Brand[]
}

export function MobileMenu({
    isOpen,
    onClose,
    categories = [],
    brands = [],
}: MobileMenuProps) {
    // --- State ---
    const pathname = usePathname()
    const [openCategory, setOpenCategory] = useState(false)
    const [openBrand, setOpenBrand] = useState(false)
    const router = useRouter()
    const { navigateToProducts } = useCategoryNavigation();

    // Helper for active link styles
    const getLinkClass = (path: string) => {
        const isActive = pathname === path
        return `flex items-center justify-between p-3 rounded-lg font-medium menu-item-animate transition-all duration-200 ${isActive
            ? "bg-primary/5 text-primary border-l-4 border-primary pl-2 shadow-sm"
            : "hover:bg-gray-50 text-gray-700"
            }`
    }

    // Search State
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    // Auth
    const { data: userData } = useGetUserQuery();
    const [logout] = useLogoutMutation();
    const user = userData?.data?.user;
    const dispatch = useDispatch();


    const handleLogout = async () => {
        await logout();
        dispatch(setUser(null));
        dispatch(userApi.util.resetApiState());
        toast.success("Logged out successfully!");
        router.push("/home");
        onClose();
    }

    // --- Refs ---
    const containerRef = useRef<HTMLDivElement>(null)
    const drawerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const categoryContentRef = useRef<HTMLDivElement>(null)
    const brandContentRef = useRef<HTMLDivElement>(null)

    // --- Search Logic (Adapted from SearchBar) ---
    const {
        list: products,
        isFetching,
        isLoading: isInitialLoading,
        reset,
    } = useInfiniteScrollPagination<Product>({
        useQueryHook: useGlobalSearchQuery as any,
        limit: 10,
        search: debouncedQuery,
    })

    // Debounce Effect
    useEffect(() => {
        if (!query) {
            setDebouncedQuery("");
            return;
        }

        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(handler);
    }, [query]);

    const handleClearSearch = () => {
        setQuery("");
        setDebouncedQuery("");
    };

    const handleCategoryClick = (id: string) => {
        navigateToProducts({ category_id: id });
    };

    const handleBrandClick = (id: string) => {
        navigateToProducts({ brand_id: id });
    };


    // --- Animations ---
    useGSAP(() => {
        const tl = gsap.timeline()

        if (isOpen) {
            // 1. Overlay Fade In
            tl.to(overlayRef.current, {
                opacity: 1,
                visibility: "visible",
                duration: 0.3,
                ease: "power2.out",
            })
                // 2. Drawer Slide In
                .to(drawerRef.current, {
                    x: "0%",
                    duration: 0.4,
                    ease: "power3.out",
                }, "-=0.3") // Start slightly before overlay finishes
                // 3. Stagger Content
                .fromTo(".menu-item-animate",
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" },
                    "-=0.2"
                )
        } else {
            // Close Animation
            tl.to(drawerRef.current, {
                x: "-100%",
                duration: 0.3,
                ease: "power3.in",
            })
                .to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        gsap.set(overlayRef.current, { visibility: "hidden" })
                    }
                }, "-=0.1")
        }
    }, { dependencies: [isOpen], scope: containerRef })

    // Accordion Animation for Categories
    useGSAP(() => {
        if (!categoryContentRef.current) return
        if (openCategory) {
            gsap.to(categoryContentRef.current, { height: "auto", duration: 0.3, ease: "power2.out" })
        } else {
            gsap.to(categoryContentRef.current, { height: 0, duration: 0.3, ease: "power2.in" })
        }
    }, { dependencies: [openCategory] })

    // Accordion Animation for Brands
    useGSAP(() => {
        if (!brandContentRef.current) return
        if (openBrand) {
            gsap.to(brandContentRef.current, { height: "auto", duration: 0.3, ease: "power2.out" })
        } else {
            gsap.to(brandContentRef.current, { height: 0, duration: 0.3, ease: "power2.in" })
        }
    }, { dependencies: [openBrand] })

    return (
        <div ref={containerRef} className="relative z-[200]">
            {/* Backdrop Overlay */}
            <div
                ref={overlayRef}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm opacity-0 invisible"
            />

            {/* Side Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 left-0 h-full w-[85%] max-w-[350px] bg-white z-[201] shadow-2xl overflow-hidden flex flex-col -translate-x-full"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b shrink-0">
                    <h2 className="text-xl font-bold font-serif text-primary">Fragrance Kart</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search perfumes..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-gray-50 border-gray-200 pl-10 rounded-xl"
                        />
                        {query && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">

                    {/* SEARCH RESULTS VIEW */}
                    {query.length > 0 ? (
                        <div className="p-4 space-y-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Search Results
                            </h3>

                            {(isInitialLoading || (isFetching && products.length === 0)) ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : products.length > 0 ? (
                                <ul className="space-y-3">
                                    {products.map((product) => (
                                        <li key={product._id}>
                                            <Link
                                                href={`/products/${product._id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-gray-100 border">
                                                    <Image // Changed to Next.js Image
                                                        src={product.image_urls?.[0] || "/placeholder-perfume.png"}
                                                        alt={product.name}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.brand?.name}</p>
                                                </div>
                                                <div className="text-sm font-semibold text-primary">
                                                    ₹{product.discount_price || product.price}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground text-sm">
                                    No results found for "{query}"
                                </div>
                            )}
                        </div>
                    ) : (
                        /* DEFAULT MENU VIEW */
                        <>
                            {/* Quick Actions */}
                            <div className="grid grid-cols-3 gap-2 p-4 border-b">
                                <Link href="/wishlist" onClick={onClose} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-primary transition-colors gap-2 menu-item-animate">
                                    <Heart className="h-5 w-5" />
                                    <span className="text-xs font-medium">Wishlist</span>
                                </Link>
                                <Link href="/cart" onClick={onClose} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-primary transition-colors gap-2 menu-item-animate">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="text-xs font-medium">Cart</span>
                                </Link>
                                <Link href="/account/profile" onClick={onClose} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-primary transition-colors gap-2 menu-item-animate">
                                    <User className="h-5 w-5" />
                                    <span className="text-xs font-medium">Profile</span>
                                </Link>

                                {/* AI Matcher */}
                                <AiScentMatch
                                    onOpen={onClose}
                                    trigger={
                                        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-primary transition-colors gap-2 cursor-pointer menu-item-animate">
                                            <Sparkles className="h-5 w-5" />
                                            <span className="text-xs font-medium">AI Match</span>
                                        </div>
                                    }
                                />
                            </div>

                            {/* Navigation Links */}
                            <nav className="p-4 space-y-1">
                                <Link href="/home" onClick={onClose} className={getLinkClass("/home")}>
                                    Home
                                </Link>
                                <Link href="/about" onClick={onClose} className={getLinkClass("/about")}>
                                    About
                                </Link>

                                {/* Categories Accordion */}
                                <div className="menu-item-animate">
                                    <button
                                        onClick={() => setOpenCategory(!openCategory)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                    >
                                        Categories
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openCategory ? "rotate-180" : ""}`} />
                                    </button>
                                    <div ref={categoryContentRef} className="h-0 overflow-hidden">
                                        <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-gray-100 ml-3">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    navigateToProducts({});
                                                    onClose();
                                                }}
                                                className="w-full justify-start text-left font-normal text-sm text-gray-600 hover:text-primary hover:bg-amber-50 h-auto py-2 px-3"
                                            >
                                                View All Products
                                            </Button>
                                            {categories.slice(0, 8).map(cat => (
                                                <Button
                                                    key={cat._id}
                                                    variant="ghost"
                                                    onClick={() => {
                                                        handleCategoryClick(cat._id);
                                                        onClose();
                                                    }}
                                                    className="w-full justify-start text-left font-normal text-sm text-gray-600 hover:text-primary hover:bg-amber-50 h-auto py-2 px-3"
                                                >
                                                    {cat.name}
                                                </Button>
                                            ))}
                                            {/* "View All" for Categories can just go to /products to match MegaMenu behavior or specific logic if needed. 
                                                MegaMenu didn't have a "View All Categories" inside the list, but it had categories list.
                                                However, standard behavior is usually just reset filters or go to products. 
                                                Let's stick to the requested behavior: "view more want to work as like in the megamenu's brand's"
                                                MegaMenu brands view more opens that brand. 
                                                For "View All Categories", let's map it to clearing category filter or just products page.
                                            */}
                                            {/* <Button
                                                variant="ghost" 
                                                onClick={() => {
                                                    navigateToProducts({}); // Clear filters? Or just go to products
                                                    onClose();
                                                }}
                                                className="block w-full text-left p-2 text-sm font-semibold text-primary hover:underline"
                                            >
                                                View All Categories →
                                            </Button> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Brands Accordion */}
                                <div className="menu-item-animate">
                                    <button
                                        onClick={() => setOpenBrand(!openBrand)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                    >
                                        Popular Brands
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openBrand ? "rotate-180" : ""}`} />
                                    </button>
                                    <div ref={brandContentRef} className="h-0 overflow-hidden">
                                        <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-gray-100 ml-3">
                                            {brands.slice(0, 8).map(brand => (
                                                <Button
                                                    key={brand._id}
                                                    variant="ghost"
                                                    onClick={() => {
                                                        handleBrandClick(brand._id);
                                                        onClose();
                                                    }}
                                                    className="w-full justify-start text-left font-normal text-sm text-gray-600 hover:text-primary hover:bg-amber-50 h-auto py-2 px-3"
                                                >
                                                    {brand.name}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    navigateToProducts({});
                                                    onClose();
                                                }}
                                                className="w-full justify-start text-left font-semibold text-sm text-primary hover:bg-amber-50 h-auto py-2 px-3"
                                            >
                                                View All Brands →
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/contact" onClick={onClose} className={getLinkClass("/contact")}>
                                    Contact
                                </Link>
                            </nav>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 shrink-0">
                    {user ? (
                        <Button
                            variant="destructive"
                            className="w-full rounded-full py-6 text-base font-semibold shadow-lg shadow-red-500/20 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            className="w-full rounded-full py-6 text-base font-semibold shadow-lg shadow-primary/20 cursor-pointer"
                            onClick={() => {
                                onClose()
                                router.push("/login")
                            }}
                        >
                            Login / Sign Up
                        </Button>
                    )}
                </div>

            </div>
        </div>
    )
}
