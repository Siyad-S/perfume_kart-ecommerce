"use client";

import { useResetPasswordMutation } from "@/src/redux/apis/users";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast, Toaster } from "sonner";
import { PasswordInput } from "@/src/components/ui/password-input";

function AdminResetPasswordContent() {
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
                router.push("/admin/auth");
            }, 2000);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password");
        }
    };

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
                        Secure your account to continue managing your digital storefront.
                    </p>
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
                            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Security</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Enter your new password below.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/admin/auth" className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors">
                            ← Return to Login
                        </Link>
                    </div>
                </div>
            </div>

            <Toaster richColors position="top-right" theme="light" />
        </div>
    );
}

export default function AdminResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <AdminResetPasswordContent />
        </Suspense>
    );
}
