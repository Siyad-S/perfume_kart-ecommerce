"use client";
import { LoginForm } from "@/src/components/admin/login/loginForm";
import { SignupForm } from "@/src/components/admin/login/signupForm";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Suspense } from "react";

function AuthPageContent() {
    const [isLogin, setIsLogin] = useState(true);
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/home";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                {/* Brand / Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center justify-center w-full h-[80px] w-[100px]">
                        <img
                            src="/fragrance_kart_ecommerce_logo.png" // replace with your ecommerce logo
                            alt="Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {isLogin ? "Welcome Back" : "Create Your Account"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isLogin ? "Login to continue shopping" : "Join us and start shopping"}
                    </p>
                </div>

                {/* Tab header */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 font-medium ${isLogin
                            ? "border-b-2 border-gray-600 text-gray-600"
                            : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 font-medium ${!isLogin
                            ? "border-b-2 border-gray-600 text-gray-600"
                            : "text-gray-500"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Conditional Form */}
                {isLogin ? (
                    <>
                        <LoginForm redirect={redirect} />
                        {/* Forgot password */}
                        <p className="mt-3 text-sm text-right">
                            <a href="/forgot-password" className="text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </p>
                    </>
                ) : (
                    <>
                        <SignupForm setIsLogin={setIsLogin} />
                        {/* Terms & Privacy */}
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            By signing up, you agree to our{" "}
                            <a href="/terms" className="underline">
                                Terms
                            </a>{" "}
                            &{" "}
                            <a href="/privacy" className="underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </>
                )}

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300" />
                    <span className="px-3 text-sm text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-300" />
                </div>

                {/* Social Login (Google placeholder) */}
                <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 text-gray-700 hover:bg-gray-50">
                    <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthPageContent />
        </Suspense>
    );
}
