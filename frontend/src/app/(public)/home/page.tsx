import React from "react";
import About from "@/src/components/user/about";
import BannerSlider from "@/src/components/user/bannerSlider";
import BestSellers from "@/src/components/user/bestSellers";
import Categories from "@/src/components/user/categories";
import Footer from "@/src/components/user/footer";
import ProductScroller from "@/src/components/user/productScroller";
import Trendings from "@/src/components/user/trendings";

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
