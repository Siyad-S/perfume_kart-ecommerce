"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
    const containerRef = useRef<HTMLElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%", // Start animation when top of section hits 80% viewport height
                    toggleActions: "play none none none",
                }
            })

            // Image Parallax / Scale Reveal
            tl.fromTo(imageRef.current,
                { scale: 1.2, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
            )

            // Text Stagger Reveal
            tl.fromTo(textRef.current?.children || [],
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
                "-=0.8" // Overlap with image animation
            )
        });
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Section */}
                    <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                        <div ref={imageRef} className="w-full h-full relative">
                            <Image
                                src="/our-story/our-story.png"
                                alt="Perfume Craftsmanship"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-multiply" />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 hidden md:block">
                            <p className="text-xs font-semibold tracking-widest text-primary uppercase text-center">Since</p>
                            <p className="text-2xl font-serif font-bold text-gray-900">1970</p>
                        </div>
                    </div>

                    {/* Text Section */}
                    <div ref={textRef} className="flex flex-col space-y-6">
                        <div className="inline-flex items-center space-x-2">
                            <div className="w-12 h-[1px] bg-primary"></div>
                            <span className="text-sm font-semibold tracking-widest text-primary uppercase">Our Heritage</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                            Crafting Memories <br /> <span className="text-gray-400 italic">Through Scent</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Carrying a 50 year legacy rooted in a blend of Western & Oriental
                            craftsmanship, our brand celebrates the space in which two seemingly
                            opposed worlds come together.
                        </p>

                        <p className="text-base text-gray-500 leading-relaxed">
                            Born from precious beginnings and built on achievements aplenty, this fusion of creation allows us to
                            transform our local knowledge into a universal quality brand. We believe every scent tells a story, and we are here to help you write yours.
                        </p>

                        <div className="pt-4">
                            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105">
                                <Link href="/about">
                                    Discover Our Story
                                </Link>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
