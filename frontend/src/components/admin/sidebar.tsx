"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import {
  LayoutDashboard,
  Tags,
  Grid,
  Package,
  ShoppingCart,
  CreditCard,
  Image as ImageIcon,
  X,
  Menu,
  Settings,
  Users
} from "lucide-react";

type SidebarGroup = {
  title: string;
  items: {
    label: string;
    icon: React.ElementType;
    href: string;
    activePrefix?: string;
  }[];
}

const sidebarGroups: SidebarGroup[] = [
  // {
  //   title: "Overview",
  //   items: [
  //     { label: "Dashboard", icon: LayoutDashboard, href: "/admin", activePrefix: "/admin" },
  //   ]
  // },
  {
    title: "Catalog",
    items: [
      { label: "Products", icon: Package, href: "/admin/products/list", activePrefix: "/admin/products" },
      { label: "Categories", icon: Grid, href: "/admin/categories" },
      { label: "Brands", icon: Tags, href: "/admin/brands" },
      { label: "Banners", icon: ImageIcon, href: "/admin/banners" },
    ]
  },
  {
    title: "Sales & Orders",
    items: [
      { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
      { label: "Payments", icon: CreditCard, href: "/admin/payments" },
      // { label: "Shipments", icon: Truck, href: "/admin/shipments" }, 
    ]
  },
  // {
  //   title: "Management",
  //   items: [
  //     // Placeholder for now
  //     { label: "Settings", icon: Settings, href: "/admin/settings" },
  //   ]
  // }
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

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 border-r bg-card transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 border-b flex items-center px-6 gap-3">
          <div className="relative h-8 w-8">
            <Image
              src="/fragrance_kart_ecommerce_logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-serif font-bold tracking-wide text-primary">Fragrance Kart</span>
        </div>

        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="space-y-6 p-4">
            {sidebarGroups.map((group, index) => (
              <div key={index} className="px-3 py-2">
                <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map(({ label, icon: Icon, href, activePrefix }) => {
                    // Check if path is active
                    let isActive = false;
                    if (activePrefix) {
                      if (activePrefix === "/admin") {
                        // Only match exact /admin or /admin/ or query params
                        isActive = pathname === "/admin" || pathname === "/admin/";
                      } else {
                        isActive = pathname?.startsWith(activePrefix);
                      }
                    } else {
                      // Fallback matching
                      isActive = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
                    }

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
