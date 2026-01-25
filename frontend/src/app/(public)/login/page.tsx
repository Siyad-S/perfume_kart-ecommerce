"use client";

import { LoginForm } from "@/src/components/admin/login/loginForm";
import { SignupForm } from "@/src/components/admin/login/signupForm";
import { useSearchParams } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GoogleLoginButton } from "@/src/components/auth/GoogleLoginButton";
import { ForgotPasswordForm } from "@/src/components/auth/ForgotPasswordForm";

function AuthPageContent() {
    // viewState: 'login' | 'signup' | 'forgot-password'
    const [viewState, setViewState] = useState<'login' | 'signup' | 'forgot-password'>('login');
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/home";

    const containerRef = useRef<HTMLDivElement>(null);
    const imagePanelRef = useRef<HTMLDivElement>(null);
    const formPanelRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Image Panel Reveal (Slide in from left + Scale)
        tl.fromTo(imagePanelRef.current,
            { xPercent: -100, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
            // 2. Form Panel Reveal (Fade in + Slide up)
            .fromTo(formPanelRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.6" // Overlap animations
            )
            // 3. Stagger children of form panel
            .fromTo(".form-animate-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
                "-=0.4"
            );

    }, { scope: containerRef });

    // Animate transition between Views
    useGSAP(() => {
        if (!formPanelRef.current) return;

        const container = formPanelRef.current.querySelector(".auth-form-container");

        // Simple fade and slide transition based on state change
        gsap.fromTo(container,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
        );
    }, { dependencies: [viewState], scope: formPanelRef });

    return (
        <div ref={containerRef} className="min-h-screen w-full flex bg-gray-50 overflow-hidden">

            {/* Left: Brand Image Panel (Hidden on Mobile) */}
            <div
                ref={imagePanelRef}
                className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden"
            >
                <Image
                    src="/banner/banner-2.png" // You might want to pick a specific "auth" image
                    alt="Fragrance Art"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    sizes="50vw"
                    priority
                />
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
                        Discover Your <br /> Signature Scent
                    </h2>
                    <p className="text-lg text-gray-200 font-light leading-relaxed">
                        Join our community of fragrance enthusiasts and explore a world of curated perfumes crafted for every occasion.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <div className="h-1 w-3 bg-white/30 rounded-full"></div>
                        <div className="h-1 w-3 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right: Auth Form Panel */}
            <div
                ref={formPanelRef}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative"
            >
                {/* Background Pattern for mobile feel */}
                <div className="lg:hidden absolute inset-0 z-0 opacity-5">
                    <Image
                        src="/assets/pattern.png" // Fallback or pattern
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl sm:bg-white sm:backdrop-blur-none p-8 rounded-2xl shadow-2xl sm:shadow-none border sm:border-none border-white/20">

                    {/* Header */}
                    <div className="text-center mb-10 form-animate-item">
                        <Link href="/home" className="inline-block mb-4 hover:scale-105 transition-transform">
                            <Image
                                src="/fragrance_kart_ecommerce_logo.png"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="mx-auto object-contain"
                            />
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                            {viewState === 'login' && "Welcome Back"}
                            {viewState === 'signup' && "Create Account"}
                            {viewState === 'forgot-password' && "Reset Password"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {viewState === 'login' && "Enter your credentials to access your account"}
                            {viewState === 'signup' && "Fill in your details to get started"}
                            {viewState === 'forgot-password' && "Enter your email to receive a reset link"}
                        </p>
                    </div>

                    {/* Tab Switcher - Only show for Login/Signup */}
                    {viewState !== 'forgot-password' && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative form-animate-item">
                            <button
                                onClick={() => setViewState('login')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${viewState === 'login'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setViewState('signup')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${viewState === 'signup'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {/* Form Container */}
                    <div className="auth-form-container form-animate-item">
                        {viewState === 'login' && (
                            <>
                                <LoginForm redirect={redirect} />
                                <div className="mt-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setViewState('forgot-password')}
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </>
                        )}

                        {viewState === 'signup' && (
                            <>
                                <SignupForm setIsLogin={(val) => setViewState(val ? 'login' : 'signup')} />
                                <p className="text-xs text-center text-gray-500 mt-6 px-4">
                                    By creating an account, you agree to our{' '}
                                    <Link href="/terms" className="text-gray-900 hover:underline">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-gray-900 hover:underline">Privacy Policy</Link>.
                                </p>
                            </>
                        )}

                        {viewState === 'forgot-password' && (
                            <ForgotPasswordForm onBackToLogin={() => setViewState('login')} portal="user" />
                        )}
                    </div>

                    {/* Social Divider */}
                    {viewState === 'login' && (
                        <div className="relative my-8 form-animate-item">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 uppercase tracking-wider text-xs font-medium">Or continue with</span>
                            </div>
                        </div>
                    )}

                    {/* Google Login */}
                    {viewState === 'login' && (
                        <div className="form-animate-item">
                            <GoogleLoginButton />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <AuthPageContent />
        </Suspense>
    );
}
