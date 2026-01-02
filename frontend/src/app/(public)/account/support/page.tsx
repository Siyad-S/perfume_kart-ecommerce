"use client";

import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, User, AtSign, HelpCircle, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useContactSupportMutation } from "@/src/redux/apis/support";

export default function SupportPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contactSupport, { isLoading }] = useContactSupportMutation();

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
                await contactSupport(values).unwrap();
                toast.success("Message sent! We'll get back to you soon.");
                resetForm();
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to send message. Please try again.");
            }
        },
    });

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.fromTo(
            ".support-header",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
        )
            .fromTo(
                ".support-content",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                "-=0.3"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-4xl">
            <div className="support-header mb-8 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
                <p className="text-gray-500 mt-1">We're here to help. Send us a message.</p>
            </div>

            <div className="support-content grid md:grid-cols-3 gap-8 md:gap-12">

                {/* Visual / Contact Info Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-4">
                            <Mail className="w-5 h-5 text-gray-900" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-sm text-gray-500 mb-2">For general inquiries</p>
                        <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} className="text-sm font-medium text-black hover:underline">
                            {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
                        </a>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Need help?</h3>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Our support team typically responds within 24 hours on business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="md:col-span-2">
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        className="pl-9 bg-gray-50/50 focus:bg-white"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Your email"
                                        className="pl-9 bg-gray-50/50 focus:bg-white"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Message</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    rows={5}
                                    className="pl-9 bg-gray-50/50 focus:bg-white min-h-[120px]"
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.message && formik.errors.message && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black hover:bg-gray-800 text-white min-w-[150px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
