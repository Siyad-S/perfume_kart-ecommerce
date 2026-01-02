"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    ShoppingBag,
    MapPin,
    Shield,
    HeadphonesIcon,
    LogOut,
    ChevronRight
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/src/lib/utils";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);

    const navItems = [
        { href: "/account/profile", label: "Profile Info", icon: User },
        { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
        { href: "/account/addresses", label: "Addresses", icon: MapPin },
        { href: "/account/security", label: "Security", icon: Shield },
        { href: "/account/support", label: "Support", icon: HeadphonesIcon },
    ];

    useGSAP(() => {
        // Sidebar entry animation
        gsap.fromTo(
            ".sidebar-item",
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }
        );

        // Content entry animation
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );
    }, { scope: sidebarRef });

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside
                        ref={sidebarRef}
                        className="w-full lg:w-72 flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="font-bold text-xl tracking-tight text-gray-900">My Account</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage your settings</p>
                            </div>

                            <nav className="p-3 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "sidebar-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "text-black bg-gray-50"
                                                    : "text-gray-600 hover:text-black hover:bg-gray-50 bg-transparent"
                                            )}
                                        >
                                            {/* Active Indicator Line */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-full" />
                                            )}

                                            <div className="flex items-center gap-3 relative z-10">
                                                <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-gray-400 group-hover:text-black")} />
                                                <span>{item.label}</span>
                                            </div>

                                            {isActive && (
                                                <ChevronRight className="w-4 h-4 text-gray-400 relative z-10" />
                                            )}
                                        </Link>
                                    );
                                })}

                                <button
                                    className="sidebar-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-4"
                                    onClick={() => {
                                        // Optional: Add logout handler passed from parent or context if needed here
                                        // For now just consistent styling
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Log Out</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main
                        ref={contentRef}
                        className="flex-1 min-w-0"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
