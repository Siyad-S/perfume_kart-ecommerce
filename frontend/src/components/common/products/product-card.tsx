"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useCart } from "@/src/hooks/useCartProducts";

type ProductCardProps = {
    _id: string;
    name: string;
    price: number;
    image_urls: string[];
    className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
    _id,
    name,
    price,
    image_urls,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Use Custom Hook
    const { addToCart, isUpdating } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if button is inside a Link wrapper (optional safety)
        addToCart({ _id, name, price, image_urls }, 1);
    };

    return (
        <div
            className={`flex flex-col items-center text-center bg-white border border-grey p-4 
        transition-all duration-300
        ${className}
        ${isHovered ? "shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "border-grey"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${_id}`}>
                <div className="w-32 h-40 relative mb-3">
                    <Image
                        src={isHovered && image_urls[1] ? image_urls[1] : image_urls[0]}
                        alt={name}
                        fill
                        className="object-contain transition-all duration-300"
                        priority
                    />
                </div>
            </Link>

            <h3 className="text-sm font-medium uppercase">{name}</h3>
            <p className="text-gray-700 font-semibold my-2">₹ {price.toFixed(2)}</p>

            <Button
                onClick={handleAddToCart}
                className="bg-black text-white rounded-full px-6 py-2 hover:bg-[#8c543d] transition"
                disabled={isUpdating}
            >
                {isUpdating ? "Adding..." : "Add to Cart"}
            </Button>
        </div>
    );
};

export default ProductCard;