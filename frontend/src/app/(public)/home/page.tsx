import React from "react";
import About from "@/src/components/public/about";
import BannerSlider from "@/src/components/public/bannerSlider";
import BestSellers from "@/src/components/public/bestSellers";
import Categories from "@/src/components/public/categories";
import ProductScroller from "@/src/components/public/productScroller";
import Trendings from "@/src/components/public/trendings";

export default function Home() {
  return (
    <div className="font-sans w-full">
      <BannerSlider />
      <BestSellers />
      <Categories from="home" />
      <Trendings />
      <ProductScroller />
      <About />
    </div>
  )
}
