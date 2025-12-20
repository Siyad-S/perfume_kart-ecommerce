"use client";

import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export default function SupportPage() {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            message: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            message: Yup.string()
                .min(10, "Message must be at least 10 characters")
                .required("Message is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                // TODO: Replace with actual support API call
                console.log("Support message:", values);
                toast.success("Your support request has been sent!");
                resetForm();
            } catch {
                toast.error("Failed to send support request. Please try again later.");
            }
        },
    });

    return (
        <div className="space-y-6 max-w-md">
            <h1 className="text-xl font-semibold">Support</h1>
            <p className="text-gray-600">
                Contact us at{" "}
                <b className="text-black">support@fragrancekart.com</b> or fill the form below:
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>

                {/* Message */}
                <div>
                    <Textarea
                        name="message"
                        placeholder="Message"
                        rows={4}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.message && formik.errors.message && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </div>
    );
}
