"use client";

import { useTypedSelector } from "@/src/redux/store";
import { useGetOrdersQuery } from "@/src/redux/apis/orders";
import { useGetAddressesQuery } from "@/src/redux/apis/users";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ShoppingBag, MapPin, User, ArrowRight, Package, Truck, Clock } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function AccountDashboard() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery(
        { limit: 1 }, // Just get the latest one
        { skip: !isLoggedIn }
    );

    const { data: addressData, isLoading: addressLoading } = useGetAddressesQuery(
        user?._id || "",
        { skip: !isLoggedIn }
    );

    const recentOrder = ordersData?.data?.data?.[0];
    const defaultAddress = addressData?.data?.find(a => a.isDefault) || addressData?.data?.[0];

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(".dashboard-header", { opacity: 0, y: 10, duration: 0.5 })
            .from(".stats-card", {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.4,
                clearProps: "all"
            }, "-=0.2")
            .from(".recent-section", {
                opacity: 0,
                y: 20,
                stagger: 0.15,
                duration: 0.5,
                clearProps: "all"
            }, "-=0.2");

    }, { scope: containerRef });

    if (!isLoggedIn) return null; // Or meaningful loading/redirect handled by layout/middleware

    return (
        <div ref={containerRef} className="space-y-8">

            {/* Header */}
            <div className="dashboard-header border-b border-gray-100 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Hello, {user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 mt-1">
                    From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                </p>
            </div>

            {/* Quick Stats / Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Link href="/account/orders" className="block group">
                    <Card className="stats-card p-6 border-gray-100 hover:border-gray-300 transition-colors h-full flex flex-col justify-between bg-white shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                                Orders
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">My Orders</h3>
                            <p className="text-sm text-gray-500 mt-1">Check order status</p>
                        </div>
                    </Card>
                </Link>

                <Link href="/account/addresses" className="block group">
                    <Card className="stats-card p-6 border-gray-100 hover:border-gray-300 transition-colors h-full flex flex-col justify-between bg-white shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                                Addresses
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Addresses</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage delivery limits</p>
                        </div>
                    </Card>
                </Link>

                <Link href="/account/profile" className="block group">
                    <Card className="stats-card p-6 border-gray-100 hover:border-gray-300 transition-colors h-full flex flex-col justify-between bg-white shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <User className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                                Profile
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Account Details</h3>
                            <p className="text-sm text-gray-500 mt-1">Update visual info</p>
                        </div>
                    </Card>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Recent Order Preview */}
                <div className="recent-section space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Recent Order</h2>
                        <Link href="/account/orders" className="text-sm font-medium text-black hover:underline flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {ordersLoading ? (
                        <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
                    ) : recentOrder ? (
                        <Card className="p-5 border-gray-100 shadow-sm bg-white">
                            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-50">
                                <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden border border-gray-100 shrink-0">
                                    <Image
                                        src={recentOrder.ordered_items[0]?.product?.image_urls?.[0] || "/placeholder.png"}
                                        alt="Product"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-gray-900 truncate">
                                        Order #{recentOrder._id.slice(-8).toUpperCase()}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Placed on {new Date(recentOrder.order_date).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-gray-100 text-gray-800`}>
                                            <Clock className="w-3 h-3 mr-1" />
                                            {recentOrder.status}
                                        </span>
                                        <span className="text-sm font-medium">
                                            ₹{recentOrder.total_amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/account/orders">
                                <Button variant="outline" className="w-full text-xs h-9">
                                    Track Order
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center p-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-gray-900 font-medium">No orders yet</p>
                            <p className="text-sm text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <Link href="/products">
                                <Button size="sm" className="bg-black text-white px-6">Shop Now</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Default Address Preview */}
                <div className="recent-section space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Default Address</h2>
                        <Link href="/account/addresses" className="text-sm font-medium text-black hover:underline flex items-center">
                            Manage <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {addressLoading ? (
                        <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
                    ) : defaultAddress ? (
                        <Card className="p-5 border-gray-100 shadow-sm bg-white h-full max-h-[220px] flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{defaultAddress.fullName}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <p className="leading-relaxed">
                                    {defaultAddress.street}<br />
                                    {defaultAddress.city}, {defaultAddress.state}<br />
                                    {defaultAddress.country} - {defaultAddress.postal_code}
                                </p>
                            </div>
                            <div className="mt-auto pt-4">
                                <Link href="/account/addresses">
                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black p-0 h-auto font-normal">
                                        Edit Address
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center p-6">
                            <MapPin className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-gray-900 font-medium">No address saved</p>
                            <p className="text-sm text-gray-500 mb-4">Add a default address for faster checkout.</p>
                            <Link href="/account/addresses">
                                <Button variant="outline" size="sm">Add Address</Button>
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
