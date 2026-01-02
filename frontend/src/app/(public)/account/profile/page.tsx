"use client";

import React, { useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useGetUserQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { Loader2, Save, User, Mail, Phone, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/src/lib/utils";

export default function ProfilePage() {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;
    const containerRef = useRef<HTMLDivElement>(null);

    const isLoggedIn = !!user?._id;
    const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
                .required("Phone number is required"),
        }),
        onSubmit: async (values) => {
            try {
                if (!isLoggedIn) {
                    toast.error("Please log in to update your profile");
                    return;
                }

                const res = await updateProfile({ id: user?._id, updates: values });

                if ("data" in res && res.data) {
                    toast.success("Profile updated successfully!");
                } else {
                    toast.error("Failed to update profile");
                }
            } catch {
                toast.error("Failed to update profile");
            }
        },
    });

    const handleLogout = () => {
        // TODO: Replace with your actual logout logic
        toast.info("Logged out successfully!");
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.fromTo(
            ".profile-header",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
        )
            .fromTo(
                ".profile-field",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
                "-=0.3"
            )
            .fromTo(
                ".profile-actions",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 },
                "-=0.2"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-2xl">
            <div className="profile-header mb-8 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                <p className="text-gray-500 mt-1">Manage your personal details and contact info.</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div className="profile-field space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-xs">{formik.errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="profile-field space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.phone && formik.errors.phone && (
                            <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                        )}
                    </div>

                    {/* Email (Read-only usually, but editable here based on logic) */}
                    <div className="profile-field space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-xs">{formik.errors.email}</p>
                        )}
                    </div>
                </div>

                <div className="profile-actions flex items-center gap-4 pt-4 border-t border-gray-100 mt-8">
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting || updating}
                        className="bg-black hover:bg-gray-800 text-white min-w-[140px]"
                    >
                        {formik.isSubmitting || updating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
