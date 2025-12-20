"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Home, Tags, Grid, Package, ShoppingCart, Box, CreditCard, Star, Truck, X, Menu, Image } from "lucide-react";

const sidebarLinks = [
  // { label: "Overview", icon: Home, href: "/admin/overview" },
  { label: "Brands", icon: Tags, href: "/admin/brands" },
  { label: "Categories", icon: Grid, href: "/admin/categories" },
  { label: "Banners", icon: Image, href: "/admin/banners" },
  { label: "Products", icon: Package, href: "/admin/products/list" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  // { label: "Inventory", icon: Box, href: "/admin/inventory" },
  { label: "Payments", icon: CreditCard, href: "/admin/payments" },
  // { label: "Reviews", icon: Star, href: "/admin/reviews" },
  // { label: "Shipments", icon: Truck, href: "/admin/shipments/list" },
];


export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - use h-screen so it always fills viewport height */}
      <aside
        className={cn(
          "md:static top-0 left-0 h-screen w-64 bg-background border-r z-40 transform transition-transform duration-300 ease-in-out fixed",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* make ScrollArea full height and column layout so content stretches */}
        <ScrollArea className="h-full">
          <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-6">Admin Dashboard</h2>

            {/* nav grows to fill space if needed */}
            <div className="h-full flex flex-col justify-between">

              <nav className="space-y-1 flex-1">
                {sidebarLinks.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === href && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* optional footer area pinned to bottom */}
              {/* <div className="mt-4">
                <button className="w-full text-sm px-3 py-2 rounded-md">Logout</button>
              </div> */}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Overlay for mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}