"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/home");
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h1>
                <p className="text-gray-500 mb-6">Redirecting you to the home page...</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 h-1.5 rounded-full animate-progress origin-left w-full duration-[2000ms] transition-all"></div>
                </div>
            </div>
        </div>
    );
}
