"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "./searchBar"
import { NavIcons } from "./navIcons"
import { MobileMenuButton } from "./mobileMenuButton"
import { NavLinks } from "./navLink"
import { MegaMenu } from "./megaMenu"
import { MobileMenu } from "./mobileMenu"
import { useGetMegaMenuQuery } from "@/src/redux/apis/categories"

export const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  // 1. Fetch data in Parent
  const { data: megaMenuData, isLoading } = useGetMegaMenuQuery()

  // 2. Safely extract data with fallbacks
  const categories = megaMenuData?.data?.categories || []
  const brands = megaMenuData?.data?.brands || []
  const bestSellers = megaMenuData?.data?.bestSellers || []

  return (
    <header className="border-b bg-background sticky top-0 z-50 shadow-sm">
      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="container mx-auto flex h-[80px] items-center justify-between px-4 gap-6">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3 h-[80px]">
          <Image
            src="/fragrance_kart_ecommerce_logo.png"
            alt="Fragrance Kart Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
          <span className="text-2xl font-serif tracking-wide font-bold text-primary">
            Fragrance Kart
          </span>
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Desktop Icons */}
        <NavIcons />

        {/* Mobile Menu Button */}
        <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Desktop navigation */}
      <div className="hidden w-[100%] md:block border-t bg-background relative">
        <nav className="relative mx-auto flex items-center justify-center gap-8 h-12">
          {/* 3. Pass data to Child */}
          <MegaMenu
            categories={categories}
            brands={brands}
            bestSellers={bestSellers}
            isLoading={isLoading}
          />
          <NavLinks navLinks={navLinks} />
        </nav>
      </div>
    </header>
  )
}