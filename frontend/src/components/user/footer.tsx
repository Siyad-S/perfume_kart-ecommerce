"use client";

import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className=" text-black py-10 px-6 bg-gray-100">
            {/* Links & Socials */}
            <div className=" pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                {/* Shop */}
                <div>
                    <h4 className="font-semibold mb-3">SHOP</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/account">My Account</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/story">Our Story</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="font-semibold mb-3">SERVICES</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/returns">Exchange & Return</Link></li>
                        <li><Link href="/shipping">Shipping & Delivery</Link></li>
                        <li><Link href="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="font-semibold mb-3">FOLLOW US</h4>
                    <div className="flex gap-4">
                        <Link href="https://facebook.com" target="_blank"><Facebook /></Link>
                        <Link href="https://instagram.com" target="_blank"><Instagram /></Link>
                        <Link href="https://youtube.com" target="_blank"><Youtube /></Link>
                        <Link href="https://linkedin.com" target="_blank"><Linkedin /></Link>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 text-center text-sm border-t border-gray-400 pt-6">
                © {new Date().getFullYear()} Fragance Cart. All rights reserved.
            </div>
        </footer>
    );
}
