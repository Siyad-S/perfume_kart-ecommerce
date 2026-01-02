"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Eye, EyeOff, Lock, Key, ShieldCheck, Loader2 } from "lucide-react";
import { useTypedSelector } from "@/src/redux/store";
import { useUpdateUserMutation } from "@/src/redux/apis/users";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SecurityPage() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;
    const containerRef = useRef<HTMLDivElement>(null);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const formik = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Current password is required"),
            newPassword: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .matches(/[A-Z]/, "Must contain at least one uppercase letter")
                .matches(/[a-z]/, "Must contain at least one lowercase letter")
                .matches(/[0-9]/, "Must contain at least one number")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match")
                .required("Please confirm your password"),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!isLoggedIn) {
                toast.error("Please log in to update your password");
                return;
            }

            try {
                const res = await updateUser({
                    id: user!._id,
                    updates: {
                        password: values.password,
                        newPassword: values.newPassword,
                        confirmPassword: values.confirmPassword,
                    },
                });

                // SUCCESS
                if ("data" in res && res.data?.data) {
                    toast.success("Password updated successfully!");
                    resetForm();
                    return;
                }

                // ERROR – Ensure error exists
                if ("error" in res && res.error) {
                    let message = "Failed to update password";
                    const err = res.error; // now guaranteed not undefined

                    // Case 1: FetchBaseQueryError (has .data)
                    if (
                        "status" in err &&
                        err.data &&
                        typeof err.data === "object" &&
                        "message" in err.data
                    ) {
                        message = (err.data as any).message ?? message;
                    }

                    // Case 2: SerializedError (has .message)
                    if ("message" in err && err.message) {
                        message = err.message;
                    }

                    toast.error(message);
                    return;
                }

                toast.error("Failed to update password");
            } catch {
                toast.error("Something went wrong");
            }
        }
    });

    const togglePassword = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.fromTo(
            ".security-header",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
        )
            .fromTo(
                ".security-card",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                "-=0.3"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-2xl">
            <div className="security-header mb-8 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                <p className="text-gray-500 mt-1">Manage your password and account security.</p>
            </div>

            <div className="security-card bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 text-gray-900">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="font-semibold text-lg">Change Password</h2>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">

                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                type={showPassword.current ? "text" : "password"}
                                name="password"
                                placeholder="Enter current password"
                                className="pl-9 pr-10 bg-white"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword("current")}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 pt-2">
                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    className="pl-9 pr-10 bg-white"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("new")}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    className="pl-9 pr-10 bg-white"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("confirm")}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading || formik.isSubmitting}
                            className="bg-black text-white hover:bg-gray-800 min-w-[160px]"
                        >
                            {formik.isSubmitting || isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
