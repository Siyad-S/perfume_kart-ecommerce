"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
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

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter(); // Initialize Router
    const { data: product, isLoading, error } = useGetProductQuery(id as string);
    const details = product?.data?.data?.[0];
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    // Initialize Cart Hook
    const { addToCart, isUpdating } = useCart();

    // Quantity state
    const [quantity, setQuantity] = React.useState<number>(1);

    // Track which specific action is loading (Cart vs Buy Now)
    const [actionLoading, setActionLoading] = React.useState<"cart" | "buy" | null>(null);

    React.useEffect(() => {
        if (!details?.image_urls?.length) return;
        setSelectedImage(details.image_urls[0]);
    }, [details?.image_urls]);

    const calculatePrice = (price: number, discount: number) => {
        const discountedPrice = price - discount;
        return discountedPrice.toFixed(2);
    };

    // Helper: Create product payload to avoid code duplication
    const getProductPayload = () => {
        if (!details) return null;
        return {
            _id: details._id,
            name: details.name,
            price: details.discount_price
                ? details.price - details.discount_price
                : details.price,
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
        // 1. Add to cart
        await addToCart(payload, quantity);

        // 2. Redirect to checkout immediately after adding
        setActionLoading(null);
        router.push("/checkout");
    };

    const handleIncrease = () => {
        if (details?.stock_quantity && quantity < details.stock_quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    if (isLoading) {
        return <p className="p-6">Loading product...</p>;
    }

    if (error || !product?.data) {
        return <p className="p-6">Product not found</p>;
    }

    return (
        <div className="p-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/home" },
                        { label: "Products", href: "/products" },
                        { label: details?.name },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left - Images */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnails */}
                    {details?.image_urls?.length > 0 && (
                        <div className="flex lg:flex-col gap-3">
                            {details.image_urls.map((url: string, i: number) => (
                                <Image
                                    key={i}
                                    src={url}
                                    alt={`${details?.name || "Product"} ${i}`}
                                    width={80}
                                    height={80}
                                    className={`rounded-lg border h-[80px] cursor-pointer ${selectedImage === url ? "border-black" : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedImage(url)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="flex-1">
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={details?.name || "Product Image"}
                                width={500}
                                height={500}
                                className="rounded-xl w-full h-[500px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
                                <span className="text-gray-500">No Image Available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right - Info */}
                <div className="space-y-6">
                    <h5 className="capitalize text-black mb-0">{details?.brand?.name}</h5>
                    <h1 className="text-3xl font-bold mb-1">{details?.name}</h1>

                    {details?.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                            {details.tags.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="flex items-center gap-1 text-gray-700"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <h6 className="text-sm capitalize text-gray-600 mb-0">
                        {details?.category?.name}
                    </h6>
                    <div className="flex items-center gap-2">
                        <p className="text-xl text-gray-700">
                            ₹{calculatePrice(details?.price || 0, details?.discount_price || 0)}
                        </p>
                        <p className="text-sm text-red-500 line-through">
                            ₹{details?.price?.toFixed(2) || 0}
                        </p>
                    </div>

                    {/* Stock Info */}
                    <p className="text-sm text-green-600">
                        {details?.stock_quantity > 0 ? (
                            <span>{details.stock_quantity} in stock</span>
                        ) : (
                            <span className="text-red-500">Out of stock</span>
                        )}
                    </p>

                    {/* Action Section */}
                    <div className="flex flex-col gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleDecrease}
                                disabled={quantity === 1}
                            >
                                -
                            </Button>
                            <span className="w-10 text-center">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleIncrease}
                                disabled={quantity >= (details?.stock_quantity || 1)}
                            >
                                +
                            </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                disabled={details?.stock_quantity === 0 || isUpdating}
                                onClick={handleAddToCart}
                            >
                                {actionLoading === "cart" ? "Adding..." : "Add to Cart"}
                            </Button>

                            <Button
                                size="lg"
                                variant="secondary"
                                disabled={details?.stock_quantity === 0 || isUpdating}
                                onClick={handleBuyNow}
                            >
                                {actionLoading === "buy" ? "Processing..." : "Buy Now"}
                            </Button>
                        </div>
                    </div>

                    {/* Accordions */}
                    <Accordion type="single" collapsible className="w-full mt-6">
                        <AccordionItem value="description">
                            <AccordionTrigger>Description</AccordionTrigger>
                            <AccordionContent>
                                {details?.description || "No description available."}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="notes">
                            <AccordionTrigger>Notes</AccordionTrigger>
                            <AccordionContent>
                                {details?.notes ? (
                                    <div className="space-y-4">
                                        {["top", "middle", "base"].map((section) => (
                                            <div key={section}>
                                                <h4 className="font-medium capitalize mb-1">{section}</h4>
                                                <ul className="list-disc list-inside text-gray-600">
                                                    {details?.notes?.[section]?.length > 0 ? (
                                                        details.notes[section].map(
                                                            (note: string, i: number) => (
                                                                <li key={i}>{note}</li>
                                                            )
                                                        )
                                                    ) : (
                                                        <li>No {section} notes available</li>
                                                    )}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No notes available.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}