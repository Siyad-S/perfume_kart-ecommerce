"use client";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import Breadcrumbs from "@/src/components/common/breadcrumbs";
import { useGetProductQuery } from "@/src/redux/apis/products";
import { Badge } from "@/src/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion";
import { useCart } from "@/src/hooks/useCartProducts";
import { ProductDetailSkeleton } from "@/src/components/skeletons/product-detail-skeleton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Star } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: product, isLoading, error } = useGetProductQuery(id as string);
    const details = product?.data?.data?.[0];
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [actionLoading, setActionLoading] = useState<"cart" | "buy" | null>(null);

    // Refs for animation
    const containerRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLImageElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const { addToCart, isUpdating } = useCart();

    useEffect(() => {
        if (!details?.image_urls?.length) return;
        setSelectedImage(details.image_urls[0]);
    }, [details?.image_urls]);

    // Animations
    useGSAP(() => {
        if (!isLoading && details) {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(".fade-in-up",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
            );

            gsap.fromTo(mainImageRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
            );
        }
    }, { dependencies: [isLoading, details], scope: containerRef });

    // Image switch animation
    const handleImageChange = (url: string) => {
        if (url === selectedImage) return;
        gsap.to(mainImageRef.current, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setSelectedImage(url);
                gsap.to(mainImageRef.current, { opacity: 1, duration: 0.3 });
            }
        });
    };

    const calculatePrice = (price: number, discount: number) => {
        return (price - discount).toFixed(2);
    };

    const getProductPayload = () => {
        if (!details) return null;
        return {
            _id: details._id,
            name: details.name,
            price: details.discount_price ? details.price - details.discount_price : details.price,
            image_urls: details.image_urls,
        };
    };

    const handleAddToCart = async () => {
        const payload = getProductPayload();
        if (!payload) return;
        setActionLoading("cart");
        await addToCart(payload, quantity);
        setActionLoading(null);
    };

    const handleBuyNow = async () => {
        const payload = getProductPayload();
        if (!payload) return;
        setActionLoading("buy");
        await addToCart(payload, quantity);
        setActionLoading(null);
        router.push("/checkout");
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (error || !product?.data) return <div className="h-screen flex items-center justify-center text-red-500">Product not found</div>;

    const discountPercentage = details?.discount_price
        ? Math.round((details.discount_price / details.price) * 100)
        : 0;

    return (
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Breadcrumbs Header */}
            <div className="border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/home" },
                            { label: "Products", href: "/products" },
                            { label: details?.name?.substring(0, 20) + (details?.name?.length > 20 ? "..." : "") },
                        ]}
                    />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
                            {selectedImage ? (
                                <Image
                                    ref={mainImageRef}
                                    src={selectedImage}
                                    alt={details?.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-neutral-400">No Image</div>
                            )}
                            {discountPercentage > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                    -{discountPercentage}%
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {details?.image_urls?.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {details.image_urls.map((url: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => handleImageChange(url)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === url ? "border-black shadow-md ring-1 ring-black/5" : "border-neutral-200 hover:border-neutral-300"
                                            }`}
                                    >
                                        <Image src={url} alt={`View ${i}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div ref={infoRef} className="flex flex-col lg:sticky lg:top-24 h-fit">
                        <div className="fade-in-up space-y-2 mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500">{details?.brand?.name}</h2>
                                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-medium text-neutral-900">4.8</span>
                                    <span className="text-neutral-400">(120 reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">{details?.name}</h1>

                            {details?.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {details.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="rounded-full px-3 py-0.5 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 font-normal">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="fade-in-up mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-3xl font-bold text-neutral-900">
                                    ₹{calculatePrice(details?.price || 0, details?.discount_price || 0)}
                                </span>
                                {details?.discount_price > 0 && (
                                    <span className="text-lg text-neutral-400 line-through decoration-1">
                                        ₹{details?.price?.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                                {details?.stock_quantity > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        In Stock & Ready to Ship
                                    </>
                                ) : (
                                    <span className="text-red-500">Out of Stock</span>
                                )}
                            </p>
                        </div>

                        <div className="fade-in-up space-y-6">
                            {/* Features / Icons */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100">
                                    <Truck className="w-5 h-5 text-neutral-900" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100">
                                    <ShieldCheck className="w-5 h-5 text-neutral-900" />
                                    <span>Authenticity Guaranteed</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-100">
                                {/* Quantity */}
                                <div className="flex items-center border border-neutral-200 rounded-full h-12 w-fit px-2 bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black transition"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(details?.stock_quantity || 99, quantity + 1))}
                                        className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black transition"
                                        disabled={quantity >= (details?.stock_quantity || 99)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={!details?.stock_quantity || isUpdating}
                                    className="flex-1 h-12 rounded-full text-base bg-neutral-900 hover:bg-black text-white shadow-lg shadow-neutral-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {actionLoading === "cart" ? "Adding..." : "Add to Cart"}
                                </Button>
                                <Button
                                    onClick={handleBuyNow}
                                    disabled={!details?.stock_quantity || isUpdating}
                                    variant="outline"
                                    className="flex-1 h-12 rounded-full text-base border-neutral-200 hover:bg-neutral-50 transition-all"
                                >
                                    {actionLoading === "buy" ? "Processing..." : "Buy Now"}
                                </Button>
                            </div>
                        </div>

                        {/* Details Accordion */}
                        <div className="fade-in-up mt-10">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="description" className="border-b-neutral-100">
                                    <AccordionTrigger className="text-base font-medium hover:no-underline">Description</AccordionTrigger>
                                    <AccordionContent className="text-neutral-600 leading-relaxed pb-6">
                                        {details?.description || "No description available."}
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="notes" className="border-b-neutral-100">
                                    <AccordionTrigger className="text-base font-medium hover:no-underline">Fragrance Notes</AccordionTrigger>
                                    <AccordionContent>
                                        {details?.notes ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                                                {["top", "middle", "base"].map((section) => (
                                                    <div key={section} className="space-y-2">
                                                        <h4 className="font-semibold capitalize text-xs text-neutral-400 tracking-wider">
                                                            {section} Notes
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {details?.notes?.[section]?.length > 0 ? (
                                                                details.notes[section].map((note: string, i: number) => (
                                                                    <span key={i} className="text-sm text-neutral-800 bg-neutral-100 px-2 py-1 rounded-md">
                                                                        {note}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-neutral-400 italic">None</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-neutral-500">No notes available.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}