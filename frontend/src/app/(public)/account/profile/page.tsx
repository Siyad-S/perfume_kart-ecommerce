"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useGetUserQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { useTypedSelector } from "@/src/redux/store";

export default function ProfilePage() {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;

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
                console.log("res?.data", res?.data);

                if (res?.data) {
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
        // TODO: Replace with your logout logic
        toast.info("Logged out successfully!");
    };

    return (
        <div className="space-y-6 max-w-md">
            <h1 className="text-xl font-semibold mb-2">Profile Information</h1>
            <p className="text-sm text-gray-600">
                Update your personal details below.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                    )}
                </div>

                {/* Email (read-only) */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
