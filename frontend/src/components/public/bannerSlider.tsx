"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useGetBannersQuery } from "@/src/redux/apis/banners"
import { Skeleton } from "@/src/components/ui/skeleton"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Link from "next/link"
import { useTypedDispatch } from "@/src/redux/store"
import { setFilter } from "@/src/redux/slices/products"

export default function BannerSlider() {
    const dispatch = useTypedDispatch()
    const { data: banners, isLoading } = useGetBannersQuery({
        search: "",
        skip: null,
        limit: 5,
        sort: "createdAt_desc",
    })

    useEffect(() => {
        dispatch(setFilter({ trending: false, best_seller: false, new_launch: false }));
    }, [])

    const bannerData = banners?.data?.data || []

    // Refs for animations
    const containerRef = useRef<HTMLDivElement>(null)
    const swiperRef = useRef<any>(null)

    // Helper to animate a specific slide element
    const animateContent = (slide: HTMLElement) => {
        const title = slide.querySelectorAll(".banner-title")
        const desc = slide.querySelectorAll(".banner-desc")
        const btn = slide.querySelectorAll(".banner-btn")
        const img = slide.querySelectorAll(".banner-img")

        const tl = gsap.timeline()

        // Reset states immediately to prepare for animation
        gsap.set([title, desc, btn], { y: 30, opacity: 0 })
        gsap.set(img, { scale: 1.1 })

        // Animate In
        tl.to(img, {
            scale: 1,
            duration: 6,
            ease: "power1.out",
        }, 0)

        tl.to(title, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
        }, 0.5)

        tl.to(desc, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
        }, 0.8)

        tl.to(btn, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
        }, 1)
    }

    // Handle slide change
    const onSlideChange = (swiper: any) => {
        // swiper.slides matches the indices including duplicates
        const activeSlide = swiper.slides[swiper.activeIndex]
        if (activeSlide) {
            animateContent(activeSlide)
        }
    }

    // Initial animation on mount
    useGSAP(() => {
        if (swiperRef.current) {
            const activeSlide = swiperRef.current.slides[swiperRef.current.activeIndex]
            if (activeSlide) {
                animateContent(activeSlide)
            }
        }
    }, { scope: containerRef, dependencies: [bannerData] })

    if (isLoading) {
        return (
            <section className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-100 animate-pulse" />
        )
    }

    if (!isLoading && bannerData.length === 0) {
        return null
    }

    return (
        <section className="w-full relative group" ref={containerRef}>
            <Swiper
                modules={[Pagination, Autoplay, Navigation, EffectFade]}
                effect="fade"
                slidesPerView={1}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' !w-2 !h-2 !bg-white/50 hover:!bg-white !opacity-100 transition-all duration-300"></span>';
                    }
                }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                }}
                loop
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                onSlideChangeTransitionStart={onSlideChange}
                className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh]"
            >
                {bannerData.map((banner: any, index: number) => (
                    <SwiperSlide key={banner._id} className="relative w-full h-full overflow-hidden bg-black">
                        {/* Image Layer */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={banner?.banner_url}
                                alt={banner?.banner_text || "Premium Perfume"}
                                fill
                                className="banner-img object-cover object-center"
                                priority={index === 0}
                            />
                        </div>

                        {/* Gradient Overlay - Cinematic Look */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

                        {/* Content Layer */}
                        <div className="absolute inset-x-0 bottom-0 top-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
                            <div className="max-w-2xl space-y-4 sm:space-y-6">
                                <h2 className="banner-title text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight opacity-0 translate-y-8">
                                    {banner?.banner_text}
                                </h2>
                                <p className="banner-desc text-xs sm:text-base md:text-xl text-gray-200 font-light max-w-xs sm:max-w-lg opacity-0 translate-y-8">
                                    {banner?.description}
                                </p>
                                <div className="banner-btn opacity-0 translate-y-8 pt-4">
                                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2 sm:px-8 sm:py-3 bg-white text-black text-xs sm:text-base font-medium rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn">
                                        Explore Collection
                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <div className="hidden md:flex absolute bottom-12 right-12 z-30 gap-4">
                    <button className="custom-prev w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group cursor-pointer">
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button className="custom-next w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group cursor-pointer">
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </Swiper>
        </section>
    )
}
