"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"

export function NavLinks({ navLinks }: { navLinks: { label: string; href: string }[] }) {
    const pathname = usePathname()

    return (
        <>
            {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "relative text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary py-2",
                            isActive ? "text-primary font-bold" : "text-gray-600"
                        )}
                    >
                        {link.label}
                        {/* Animated Underline */}
                        <span
                            className={cn(
                                "absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ease-out",
                                isActive ? "w-full" : "w-0 group-hover:w-full"
                            )}
                        />
                    </Link>
                )
            })}
        </>
    )
}
