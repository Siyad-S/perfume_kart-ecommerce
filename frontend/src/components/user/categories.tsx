"use client";

import { useGetCategoriesQuery } from "@/src/redux/apis/categories";
import { setCategory } from "@/src/redux/slices/categories";
import { useTypedDispatch } from "@/src/redux/store";
import Image from "next/image";
import { useCategoryNavigation } from "@/src/hooks/useCategoryNavigation";

interface Category {
  _id?: string;
  name: string;
  description?: string;
  image_file?: File;
  image_url?: string;
  created_at?: string;
}

export default function Categories(props: { from?: string }) {
  const dispatch = useTypedDispatch();
  const { navigateToProducts } = useCategoryNavigation();

  const { data: categories } = useGetCategoriesQuery({
    search: "",
    skip: 0,
    limit: 3,
    sort: "created_at_asc",
  });

  const categoriesData = categories?.data?.data || [];

  const handleCategory = (id: string = "") => {
    dispatch(setCategory(id));
  };

  return (
    <section className="w-full px-6 py-12">
      <h2 className="text-center text-2xl font-semibold tracking-wide mb-12 uppercase">
        Discover Our Collections
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {categoriesData?.map((category: Category) => (
          <a
            key={category._id}
            href="#"
            className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
            onClick={(e) => {
              e.preventDefault();
              props?.from === "home"
                ? navigateToProducts({ category_id: category._id })
                : handleCategory(category._id);
            }}
          >
            <div className="relative h-72 w-full">
              <Image
                src={category.image_url || ""}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 group-hover:bg-black/40 transition-colors px-4">
              <span className="text-white text-lg md:text-xl font-semibold uppercase tracking-wide">
                {category.name}
              </span>
              {category.description && (
                <p className="text-white text-sm md:text-base mt-2">
                  {category.description}
                </p>
              )}
            </div>
          </a>
        ))}

        <a
          href="#"
          className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
          onClick={(e) => {
            e.preventDefault();
            props?.from === "home"
              ? navigateToProducts({ category_id: "" })
              : handleCategory("");
          }}
        >
          <div className="relative h-72 w-full">
            <Image
              src={"/categories/all-types.png"}
              alt={"All"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 group-hover:bg-black/40 transition-colors px-4">
            <span className="text-white text-lg md:text-xl font-semibold uppercase tracking-wide">
              {"All"}
            </span>
            <p className="text-white text-sm md:text-base mt-2">
              {"All types of perfumes"}
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}