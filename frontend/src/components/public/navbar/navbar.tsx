"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useRef } from "react"
import { SearchBar } from "./searchBar"
import { NavIcons } from "./navIcons"
import { MobileMenuButton } from "./mobileMenuButton"
import { NavLinks } from "./navLink"
import { MegaMenu } from "./megaMenu"
import { MobileMenu } from "./mobileMenu"
import { useGetMegaMenuQuery } from "@/src/redux/apis/categories"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const { data: megaMenuData, isLoading } = useGetMegaMenuQuery()
  const categories = megaMenuData?.data?.categories || []
  const brands = megaMenuData?.data?.brands || []
  const bestSellers = megaMenuData?.data?.bestSellers || []

  const pathname = usePathname()

  useGSAP(() => {
    const showAnim = gsap.from(headerRef.current, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: "power2.inOut"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === -1) {
          showAnim.play();
        } else {
          showAnim.reverse();
        }
      },
    });

    // Entrance Animation
    gsap.set(headerRef.current, { y: -100, opacity: 0 });
    gsap.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    });

    ScrollTrigger.refresh();

  }, { scope: headerRef, dependencies: [pathname] })

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-md transition-all duration-300"
      >
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
            <span className="hidden lg:block text-2xl font-serif tracking-wide font-bold text-primary">
              Fragrance Kart
            </span>
          </Link>

          {/* Search */}
          <SearchBar />

          {/* Desktop Icons */}
          <div className="hidden md:flex">
            <NavIcons />
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Desktop navigation */}
        <div className="hidden w-[100%] md:block border-t border-gray-100 relative">
          <nav className="relative mx-auto flex items-center justify-center gap-8 h-12 text-sm font-medium">
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

      <div className={`h-[80px] md:h-[130px] ${isOpen ? "hidden" : ""}`} />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
        brands={brands}
      />
    </>
  )
}