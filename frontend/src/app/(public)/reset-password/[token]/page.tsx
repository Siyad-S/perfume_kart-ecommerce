"use client";

import { useResetPasswordMutation } from "@/src/redux/apis/users";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import { PasswordInput } from "@/src/components/ui/password-input";

function ResetPasswordContent() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const containerRef = useRef<HTMLDivElement>(null);
    const imagePanelRef = useRef<HTMLDivElement>(null);
    const formPanelRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await resetPassword({ token, password }).unwrap();
            toast.success("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password");
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Image Panel Reveal
        tl.fromTo(imagePanelRef.current,
            { xPercent: -100, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
            // 2. Form Panel Reveal
            .fromTo(formPanelRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            )
            // 3. Stagger children
            .fromTo(".form-animate-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
                "-=0.4"
            );

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen w-full flex bg-gray-50 overflow-hidden">

            {/* Left: Brand Image Panel */}
            <div
                ref={imagePanelRef}
                className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden"
            >
                <Image
                    src="/banner/banner-2.png"
                    alt="Reset Password Art"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    sizes="50vw"
                    priority
                />
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
                        Secure Your <br /> Account
                    </h2>
                    <p className="text-lg text-gray-200 font-light leading-relaxed">
                        Create a strong, unique password to keep your personal fragrance preferences and order history safe.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <div className="h-1 w-3 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right: Form Panel */}
            <div
                ref={formPanelRef}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative"
            >
                {/* Mobile bg */}
                <div className="lg:hidden absolute inset-0 z-0 opacity-5">
                    <Image
                        src="/assets/pattern.png"
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
                            Set New Password
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Please enter your new password below.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 form-animate-item">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none h-auto"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none h-auto"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center form-animate-item">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium">
                            Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
