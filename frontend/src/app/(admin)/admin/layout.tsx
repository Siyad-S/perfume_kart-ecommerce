import { AdminNav } from "@/src/components/admin/adminNav";
import { Sidebar } from "@/src/components/admin/sidebar";
import AuthLoginRedirectWrapper from "@/src/lib/authWrapper";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthLoginRedirectWrapper>
            <div className="min-h-screen bg-muted/40">
                {/* Sidebar - Fixed Left */}
                <Sidebar />

                {/* Main Content Wrapper - Pushed right on desktop */}
                <div className="flex flex-col md:pl-64 transition-all duration-300">

                    {/* Top Header */}
                    <AdminNav />

                    {/* Page Content */}
                    <main className="flex-1 p-4 md:p-6 space-y-4">
                        {children}
                    </main>
                </div>
            </div>
        </AuthLoginRedirectWrapper>
    );
}