"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useCart } from "@/src/hooks/useCartProducts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ShoppingBag } from "lucide-react";

type ProductCardProps = {
    product: {
        _id: string;
        name: string;
        price: number;
        image_urls: string[];
    };
    className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    className = "",
}) => {
    const { _id, name, price, image_urls } = product;
    const { addToCart, isUpdating } = useCart();
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    const handleMouseEnter = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: -8,
            boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
            duration: 0.4,
            ease: "power2.out",
        });
        gsap.to(imageRef.current, {
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out",
        });
        gsap.to(buttonRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
        });
    });

    const handleMouseLeave = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            duration: 0.4,
            ease: "power2.out",
        });
        gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
        });
        gsap.to(buttonRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
        });
    });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({ _id, name, price, image_urls }, 1);
    };

    return (
        <div
            ref={cardRef}
            className={`flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer relative group ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/products/${_id}`} className="block relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <Image
                    ref={imageRef}
                    src={image_urls[0]}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />

                {/* Secondary Image for Hover (Optional, handled via CSS opacity or GSAP if needed. Keeping simple via CSS for swap is often fine, but let's stick to the primary one scaling for now to match the GSAP plan) */}
                {image_urls[1] && (
                    <Image
                        src={image_urls[1]}
                        alt={name}
                        fill
                        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </Link>

            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-base font-medium text-neutral-900 line-clamp-1">{name}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-neutral-500 font-semibold">₹{price.toFixed(2)}</p>
                </div>
            </div>

            {/* Quick Add Button - Initially hidden/translated */}
            <div className="absolute bottom-20 left-4 right-4 translate-y-4 opacity-0" ref={buttonRef}>
                <Button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white hover:bg-neutral-800 rounded-xl shadow-lg flex items-center justify-center gap-2 h-11"
                    disabled={isUpdating}
                >
                    <ShoppingBag className="w-4 h-4" />
                    {isUpdating ? "Adding..." : "Add to Cart"}
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;