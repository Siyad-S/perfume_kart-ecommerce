import type { Metadata } from "next";
import { LoginNav } from "@/src/components/admin/login/loginNav";

export const metadata: Metadata = {
    title: "Perfume Kart - Admin Login",
    description: "Admin login page for Perfume Kart.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>
) {
    return (
        <>
            <LoginNav />
            <main className="w-[100%]">
                {children}
            </main>
        </>
    );
}
