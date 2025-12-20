"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";

export default function About() {
    return (
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-center text-white">
            {/* Background Image */}
            <Image
                src="/our-story/our-story.png"
                alt="Our Story Background"
                fill
                className="object-cover"
                priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative max-w-3xl px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">OUR STORY</h2>
                <p className="text-base md:text-lg leading-relaxed mb-6">
                    Carrying a 50 year legacy rooted in a blend of Western & Oriental
                    craftsmanship, our brand celebrates the space in which two seemingly
                    opposed worlds come together. Born from precious beginnings and built
                    on achievements aplenty, this fusion of creation allows us to
                    transform our local knowledge into a universal quality brand.
                </p>
                <Button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200">
                    READ MORE
                </Button>
            </div>
        </section>
    );
}
