import Link from "next/link"
import { cn } from "@/src/lib/utils"

export function NavLinks({ navLinks }: { navLinks: { label: string; href: string }[] }) {
    return (
        <>
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </>
    )
}
