"use client";

import { useRef } from "react";
import { useGetCategoriesQuery } from "@/src/redux/apis/categories";
import { setCategory } from "@/src/redux/slices/categories";
import { useTypedDispatch } from "@/src/redux/store";
import Image from "next/image";
import { useCategoryNavigation } from "@/src/hooks/useCategoryNavigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { CategoryGridSkeleton } from "@/src/components/skeletons/categories-skeleton";
import SectionHeader from "../common/section-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  _id?: string;
  name: string;
  description?: string;
  image_file?: File;
  image_url?: string;
  createdAt?: string;
}

export default function Categories(props: { from?: string }) {
  const dispatch = useTypedDispatch();
  const { navigateToProducts } = useCategoryNavigation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    search: "",
    skip: 0,
    limit: 3,
    sort: "createdAt_asc",
  });

  const categoriesData = [
    {
      _id: "",
      name: "All Collections",
      description: "Discover our complete range of exclusive perfumes.",
      image_url: "/categories/all-types.png",
    },
    ...(categories?.data?.data || []),
  ];

  const handleCategory = (id: string = "") => {
    dispatch(setCategory(id));
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".category-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [categoriesData] }
  );

  return (
    <section ref={containerRef} className="w-full px-4 md:px-8 py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto mb-12">
        <SectionHeader
          title="Curated Collections"
          subtitle="Explore our finest selection of fragrances, categorized for your unique taste."
          onViewAll={() => {
            if (props.from === 'home') navigateToProducts({ category_id: "" });
            else handleCategory("");
          }}
          actionText="View All Collections"
          className="mb-0"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {!categoriesData.length && isLoading ? (
          <CategoryGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesData?.map((category: Category) => (
              <div
                key={category._id}
                className="category-card group relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  props?.from === "home"
                    ? navigateToProducts({ category_id: category._id })
                    : handleCategory(category._id);
                }}
              >
                <Image
                  src={category.image_url || "/placeholder-category.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-white text-xl md:text-3xl font-bold mb-2 tracking-wide">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-[90%] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}