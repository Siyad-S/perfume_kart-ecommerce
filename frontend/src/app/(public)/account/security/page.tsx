"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTypedSelector } from "@/src/redux/store";
import { useUpdateUserMutation } from "@/src/redux/apis/users";

export default function SecurityPage() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;

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

    return (
        <div className="space-y-6 max-w-md">
            <h1 className="text-xl font-semibold">Security Settings</h1>
            <p className="text-sm text-gray-600">
                Manage your password and account security below.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4">

                {/* Current Password */}
                <div className="relative">
                    <Input
                        type={showPassword.current ? "text" : "password"}
                        name="password"
                        placeholder="Current Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("current")}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="relative">
                    <Input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || formik.isSubmitting}
                >
                    {formik.isSubmitting || isLoading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </div>
    );
}
