"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminAuthSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Clear the intent cookie
        Cookies.remove('admin_login_intent');

        const timer = setTimeout(() => {
            router.push("/admin/products/list");
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login Successful!</h1>
                <p className="text-gray-500 mb-6">Redirecting you to the dashboard...</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full animate-progress origin-left w-full duration-[2000ms] transition-all"></div>
                </div>
            </div>
        </div>
    );
}
