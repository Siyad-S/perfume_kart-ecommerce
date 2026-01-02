"use client";

import { useRef } from "react";
import { Mail, MapPin, Phone, Send, Instagram, Facebook, Twitter, Linkedin, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContactSupportMutation } from "@/src/redux/apis/support";
import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getErrorMessage } from "@/src/lib/utils";

// Validation Schema
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contactSupport, { isLoading }] = useContactSupportMutation();

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Hero Text
        tl.fromTo(".contact-hero",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
            // 2. Info Cards (Left)
            .fromTo(".contact-info-animate",
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.5"
            )
            // 3. Form (Right)
            .fromTo(".contact-form-animate",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.8"
            );

    }, { scope: containerRef });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await contactSupport(values).unwrap();
                toast.success("Message sent successfully! We'll get back to you soon.");
                resetForm();
            } catch (error) {
                const errMsg = getErrorMessage(error as FetchBaseQueryError);
                toast.error(errMsg || "Failed to send message. Please try again later.");
            }
        },
    });

    return (
        <main ref={containerRef} className="bg-white min-h-screen pt-[80px]">
            {/* 1. Minimal Hero */}
            <section className="py-16 md:py-32 bg-gray-50 flex items-center justify-center text-center px-4">
                <div className="contact-hero max-w-2xl">
                    <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary mb-2 md:mb-4">Get In Touch</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                        We'd Love to Hear <br /> From You.
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed px-4">
                        Whether you have a question about a scent, an order, or just want to say hello, our team is here to assist you.
                    </p>
                </div>
            </section>

            {/* 2. Content Grid */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        {/* Details */}
                        <div className="contact-info-animate grid gap-8">
                            <div className="flex gap-4 items-start group">
                                <div className="p-3 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Our Boutique</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        123 Fragrance Avenue, <br />
                                        Perfume City, PC 56789 <br />
                                        France
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="p-3 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Email Us</h3>
                                    <p className="text-gray-500 mb-1">General: hello@fragrancekart.com</p>
                                    <p className="text-gray-500">Support: support@fragrancekart.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="p-3 bg-primary/5 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Call Us</h3>
                                    <p className="text-gray-500 mb-1">+1 (555) 123-4567</p>
                                    <p className="text-sm text-gray-400">Mon - Fri, 9am - 6pm EST</p>
                                </div>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="contact-info-animate pt-8 border-t border-gray-100">
                            <h3 className="font-serif font-bold text-xl text-gray-900 mb-6">Follow Our Journey</h3>
                            <div className="flex gap-4">
                                <Link href="#" className="p-3 border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all duration-300 hover:scale-110">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-3 border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all duration-300 hover:scale-110">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-3 border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all duration-300 hover:scale-110">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-3 border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all duration-300 hover:scale-110">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Right: Contact Form */}
                    <div className="contact-form-animate bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                    <Input
                                        id="name"
                                        placeholder="Your Name"
                                        className={`bg-gray-50 border-gray-200 focus:bg-white transition-all ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className={`bg-gray-50 border-gray-200 focus:bg-white transition-all ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help?"
                                    className={`bg-gray-50 border-gray-200 focus:bg-white transition-all ${formik.touched.subject && formik.errors.subject ? 'border-red-500' : ''}`}
                                    {...formik.getFieldProps('subject')}
                                />
                                {formik.touched.subject && formik.errors.subject && (
                                    <div className="text-red-500 text-xs">{formik.errors.subject}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                                <Textarea
                                    id="message"
                                    placeholder="Write your message here..."
                                    className={`bg-gray-50 border-gray-200 focus:bg-white min-h-[150px] transition-all ${formik.touched.message && formik.errors.message ? 'border-red-500' : ''}`}
                                    {...formik.getFieldProps('message')}
                                />
                                {formik.touched.message && formik.errors.message && (
                                    <div className="text-red-500 text-xs">{formik.errors.message}</div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full rounded-xl gap-2 font-medium h-12 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                disabled={isLoading || formik.isSubmitting}
                            >
                                {isLoading ? (
                                    <>
                                        Sending... <Loader2 className="h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>

        </main>
    );
}
