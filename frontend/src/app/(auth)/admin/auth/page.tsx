"use client"
import { LoginForm } from "@/src/components/admin/login/loginForm";
import { SignupForm } from "@/src/components/admin/login/signupForm";
import Image from "next/image";
import { useState } from "react";
import { Toaster } from "sonner";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex md:w-1/2 relative">
                <Image
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/v1757400018/product-images/r6kek311pyovkzoe6cdl.webp`}
                    alt="Perfume Bottle"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold">Welcome Back</h1>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md border rounded-2xl p-8 shadow-lg bg-white">
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`px-4 py-2 font-medium rounded-l-lg ${isLogin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`px-4 py-2 font-medium rounded-r-lg ${!isLogin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Signup
                        </button>
                    </div>

                    {isLogin ? (
                        <LoginForm redirect={"/admin/brands"} />
                    ) : (
                        <SignupForm setIsLogin={setIsLogin} />
                    )}
                </div>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}
