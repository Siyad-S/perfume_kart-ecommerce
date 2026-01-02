"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Leaf, Gem, Heart } from "lucide-react";
import AboutSection from "@/src/components/public/about"; // Reusing the home page component

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Hero Text Reveal
        tl.fromTo(".about-hero-text",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );

        // Values Reveal
        gsap.fromTo(".value-card",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
                scrollTrigger: {
                    trigger: ".values-section",
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="bg-white min-h-screen pt-[80px]"> {/* pt-[80px] for fixed navbar */}

            {/* 1. Minimalist Hero */}
            <section className="relative h-[50vh] md:h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Optional: Subtle background texture or very faint image */}
                    <div className="absolute inset-0 bg-gray-50/50" />
                </div>

                <div className="relative z-10 max-w-4xl space-y-4 md:space-y-6">
                    <p className="about-hero-text text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-2 md:mb-4">
                        Since 1970
                    </p>
                    <h1 className="about-hero-text text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
                        The Essence of <br /> True Luxury.
                    </h1>
                    <p className="about-hero-text text-base md:text-lg text-gray-500 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
                        We believe that a fragrance is more than just a scent—it is an identity, a memory, and a statement of elegance.
                    </p>
                </div>
            </section>

            {/* 2. Our Story (Reused Component) */}
            <AboutSection />

            {/* 3. Core Values */}
            <section className="values-section py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {/* Value 1 */}
                        <div className="value-card flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Natural Ingredients</h3>
                            <p className="text-gray-500 leading-relaxed">
                                We source the finest rare essences from around the globe, ensuring purity and sustainability in every bottle.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="value-card flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                <Gem className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Exquisite Craftsmanship</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Blended by master perfumers using age-old techniques combined with modern innovation.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="value-card flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Passion for Scent</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Driven by a love for the art of perfumery, we strive to create scents that evoke emotion and timeless beauty.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Visual Strip */}
            <section className="relative h-[400px] w-full overflow-hidden">
                <Image
                    src="/categories/all-types.png"
                    alt="Perfume Art"
                    fill
                    className="object-cover fixed-bg" // You can add parallax logic or CSS here
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-white text-4xl md:text-5xl font-serif font-bold italic tracking-wide text-center">
                        "Unforgettable Scent, <br /> Unforgettable You."
                    </h2>
                </div>
            </section>

        </main>
    );
}
