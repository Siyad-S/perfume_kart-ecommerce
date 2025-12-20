"use client"
import React from "react"
import Link from "next/link"
import { Search, Heart, ShoppingCart, User } from "lucide-react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"

export function MobileMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [search, setSearch] = React.useState("");

    return (
        <div
            className={`fixed top-0 left-0 h-full w-full bg-white z-[200] transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={onClose} className="text-3xl font-bold leading-none">
                    ×
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
                <form className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search perfumes, brands..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-full"
                    />

                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Search className="h-5 w-5" />
                    </Button>
                </form>
            </div>

            {/* Profile Shortcuts */}
            <div className="flex items-center justify-around py-4 border-b text-sm">
                <Link href="/wishlist" onClick={onClose} className="flex flex-col items-center">
                    <Heart className="h-5 w-5 mb-1" />
                    Wishlist
                </Link>

                <Link href="/cart" onClick={onClose} className="flex flex-col items-center">
                    <ShoppingCart className="h-5 w-5 mb-1" />
                    Cart
                </Link>

                <Link href="/account/profile" onClick={onClose} className="flex flex-col items-center">
                    <User className="h-5 w-5 mb-1" />
                    Profile
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-5 space-y-4 overflow-y-auto h-[calc(100vh-200px)]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">Navigation</h3>

                <Link href="/home" onClick={onClose} className="block text-gray-700 hover:text-primary">
                    Home
                </Link>
                <Link href="/about" onClick={onClose} className="block text-gray-700 hover:text-primary">
                    About
                </Link>
                <Link href="/services" onClick={onClose} className="block text-gray-700 hover:text-primary">
                    Services
                </Link>
                <Link href="/contact" onClick={onClose} className="block text-gray-700 hover:text-primary">
                    Contact
                </Link>

                {/* Perfume Categories */}
                <div className="mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</h3>
                    <div className="space-y-2 ml-2 flex flex-col">
                        <Link href="/category/luxury-perfumes" onClick={onClose}>Luxury Perfumes</Link>
                        <Link href="/category/designer-perfumes" onClick={onClose}>Designer Perfumes</Link>
                        <Link href="/category/gift-sets" onClick={onClose}>Gift Sets</Link>
                        <Link href="/category/unisex" onClick={onClose}>Unisex</Link>
                        <Link href="/category/attars" onClick={onClose}>Attars</Link>
                        <Link href="/brands" onClick={onClose} className="font-medium text-primary">
                            View All →
                        </Link>
                    </div>
                </div>

                {/* Perfume Brands */}
                <div className="mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Popular Brands</h3>
                    <div className="space-y-2 ml-2 flex flex-col">
                        <Link href="/brands/dior" onClick={onClose}>Dior</Link>
                        <Link href="/brands/chanel" onClick={onClose}>Chanel</Link>
                        <Link href="/brands/gucci" onClick={onClose}>Gucci</Link>
                        <Link href="/brands/armani" onClick={onClose}>Armani</Link>
                        <Link href="/brands/versace" onClick={onClose}>Versace</Link>
                        <Link href="/brands" onClick={onClose} className="font-medium text-primary">
                            View All →
                        </Link>
                    </div>
                </div>

                {/* Logout/Login */}
                <div className="mt-6">
                    <Button className="w-full rounded-full" onClick={onClose}>
                        Login / Register
                    </Button>
                </div>
            </nav>
        </div>
    )
}
