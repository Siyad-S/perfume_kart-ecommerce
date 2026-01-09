"use client";

import { useRef } from "react";
import { Facebook, Instagram, Youtube, Linkedin, Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const topSectionRef = useRef<HTMLDivElement>(null);
    const bottomSectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 95%", // Start animating when top of footer enters viewport
                    toggleActions: "play none none none",
                }
            });

            // 1. Staggered reveal of columns
            if (topSectionRef.current) {
                // Reset state
                gsap.set(topSectionRef.current.children, { y: 30, opacity: 0 });

                tl.to(topSectionRef.current.children,
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
                );
            }

            // 2. Fade in bottom bar
            if (bottomSectionRef.current) {
                // Reset state
                gsap.set(bottomSectionRef.current, { opacity: 0 });

                tl.to(bottomSectionRef.current,
                    { opacity: 1, duration: 0.5, delay: 0.2 }
                );
            }
        });

    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="bg-black text-white pt-20 pb-10 border-t border-white/10 overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Top Section: Grid */}
                <div ref={topSectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h3 className="text-2xl font-serif font-bold tracking-wide mb-2">Fragrance Kart</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Curating the finest scents from around the world. Elevate your presence with our exclusive collection.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Subscribe via Email</p>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                    />
                                </div>
                                <Button size="icon" className="bg-white text-black hover:bg-gray-200 rounded-lg shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    {/* <div className="lg:col-start-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-300">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">All Perfumes</Link></li>
                            <li><Link href="/category/luxury" className="hover:text-white transition-colors">Luxury Collection</Link></li>
                            <li><Link href="/category/daily-wear" className="hover:text-white transition-colors">Daily Wear</Link></li>
                            <li><Link href="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link href="/gift-sets" className="hover:text-white transition-colors">Gift Sets</Link></li>
                        </ul>
                    </div> */}

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-300">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            {/* <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Scents Blog</Link></li> */}
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-300">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
                            {/* <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li> */}
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Socials */}
                <div ref={bottomSectionRef} className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-gray-500 text-center md:text-left">
                        <p>© {new Date().getFullYear()} Fragrance Kart. All rights reserved.</p>
                    </div>

                    <div className="flex gap-6">
                        <Link href="https://instagram.com" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"><Instagram className="h-5 w-5" /></Link>
                        <Link href="https://facebook.com" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"><Facebook className="h-5 w-5" /></Link>
                        <Link href="https://youtube.com" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"><Youtube className="h-5 w-5" /></Link>
                        <Link href="https://linkedin.com" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"><Linkedin className="h-5 w-5" /></Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
