"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/account/profile", label: "Profile Info" },
        { href: "/account/orders", label: "My Orders" },
        { href: "/account/addresses", label: "Addresses" },
        { href: "/account/security", label: "Security" }, // ✅ new tab
        // { href: "/account/support", label: "Support" },
    ];

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto h-[calc(100vh-80px)] p-6 gap-6">
            {/* Sidebar - fixed position */}
            <aside className="w-full md:w-60 bg-gray-50 border rounded-xl p-4 md:sticky md:top-[100px] h-fit self-start">
                <h2 className="font-bold text-lg mb-4">My Account</h2>
                <nav className="flex md:flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition ${pathname === item.href
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Scrollable content area */}
            <main className="flex-1 bg-white border rounded-xl shadow-sm p-6 overflow-y-auto h-full">
                {children}
            </main>
        </div>
    );
}
