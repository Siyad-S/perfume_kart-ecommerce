"use client";

import { LoginForm } from "@/src/components/admin/login/loginForm";
import { SignupForm } from "@/src/components/admin/login/signupForm";
import Image from "next/image";
import { useState, useRef } from "react";
import { Toaster } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagePanelRef = useRef<HTMLDivElement>(null);
    const formPanelRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Entrance Animation
        tl.fromTo(imagePanelRef.current,
            { xPercent: -100, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        )
            .fromTo(formPanelRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=0.8"
            )
            .fromTo(".form-content",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
                "-=0.6"
            );

        // 2. Subtle Background Flow (Light Theme)
        gsap.to(".flow-1", {
            x: 50,
            y: 50,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        gsap.to(".flow-2", {
            x: -40,
            y: -60,
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="flex min-h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans p-4">
            {/* Left Image Panel - Light Theme Visual */}
            <div
                ref={imagePanelRef}
                className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center overflow-hidden border-r border-gray-100"
            >
                {/* Abstract Background */}
                <div className="absolute inset-0 z-0 bg-white overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />

                    {/* Soft Pastel Gradients */}
                    <div className="flow-1 absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply" />
                    <div className="flow-2 absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply" />
                    <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[80px] mix-blend-multiply" />
                </div>

                <div className="relative z-10 p-16 max-w-xl">
                    <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <div className="w-8 h-8 bg-black rounded-lg transform rotate-45"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-gray-900">
                        Admin<br />Workspace.
                    </h1>
                    <p className="text-lg text-gray-500 font-normal leading-relaxed">
                        Precision tools for your digital storefront. Manage inventory, track analytics, and oversee operations in a unified environment.
                    </p>

                    <div className="mt-12 flex gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shadow-sm">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center text-sm">
                            <span className="font-semibold text-gray-900">Team Active</span>
                            <span className="text-gray-400">Collaborate securely.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div
                ref={formPanelRef}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-gray-50/50"
            >
                <div className="w-full max-w-[420px] z-10 form-content">
                    <div className="text-center mb-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-4">
                            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Secure Access</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? "Welcome Back" : "Join the Team"}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? "Please enter your details to sign in." : "Set up your admin account."}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-200/50 p-1 rounded-xl mb-8 relative">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        {isLogin ? (
                            <LoginForm redirect={"/admin"} />
                        ) : (
                            <SignupForm setIsLogin={setIsLogin} />
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/home" className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors">
                            ← Return to Storefront
                        </Link>
                    </div>
                </div>
            </div>

            <Toaster richColors position="top-right" theme="light" />
        </div>
    );
}
