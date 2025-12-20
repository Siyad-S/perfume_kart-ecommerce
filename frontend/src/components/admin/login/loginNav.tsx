"use client";

import Link from "next/link";
import { HelpDialog } from "./helpDialog";
import Image from "next/image";

export function LoginNav() {
    return (
        <header className="border-b bg-background fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Brand */}
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
                <HelpDialog />
            </div>
        </header>
    );
}
