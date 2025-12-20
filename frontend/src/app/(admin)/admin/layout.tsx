import { AdminNav } from "@/src/components/admin/adminNav";
import { Sidebar } from "@/src/components/admin/sidebar";
import AuthLoginRedirectWrapper from "@/src/lib/authWrapper";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <AuthLoginRedirectWrapper>
                <Sidebar />
                <AdminNav />
                <main className="w-[100%]">
                    {children}
                </main>
            </AuthLoginRedirectWrapper>
        </div>
    );
}