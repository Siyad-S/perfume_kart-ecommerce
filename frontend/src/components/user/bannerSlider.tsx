"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useGetBannersQuery } from "@/src/redux/apis/banners"
import { Skeleton } from "@/src/components/ui/skeleton"
import Loader from "../common/loader"

export default function BannerSlider() {
    const { data: banners, isLoading } = useGetBannersQuery({
        search: "",
        skip: null,
        limit: 4,
        sort: "created_at_desc",
    })

    const bannerData = banners?.data?.data || []

    if (isLoading) {
        return (
            <section className="w-full">
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
                    <Loader />
                </div>
            </section>
        )
    }

    if (!isLoading && bannerData.length === 0) {
        return (
            <section className="w-full">
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] 
                flex flex-col items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3">
                        No banners available right now
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition"
                    >
                        Retry
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full">
            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                loop
                className="w-full"
            >
                {bannerData.map((banner: any, index: number) => (
                    <SwiperSlide key={banner._id}>
                        <div className="relative w-full h-[300px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
                            <Image
                                src={banner?.banner_url}
                                alt={banner?.banner_text || "Banner"}
                                fill
                                className=""
                                priority={index === 0}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
                                <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2">
                                    {banner?.banner_text}
                                </h2>
                                <p className="text-xs sm:text-sm md:text-lg">
                                    {banner?.description}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="swiper-button-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer 
                    bg-black/50 hover:bg-black/70 flex items-center justify-center rounded-full text-white slider_btn">
                    <ChevronLeft className="slider_btn_icon" />
                </div>
                <div className="swiper-button-next absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer 
                    bg-black/50 hover:bg-black/70 flex items-center justify-center rounded-full text-white slider_btn">
                    <ChevronRight className="slider_btn_icon" />
                </div>
            </Swiper>
        </section>
    )
}
