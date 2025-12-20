// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
