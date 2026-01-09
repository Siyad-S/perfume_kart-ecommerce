import { Skeleton } from "@/src/components/ui/skeleton";
import React from "react";

export function MegaMenuSkeleton() {
    return (
        <div className="grid grid-cols-12 gap-10">
            {/* Skeleton: Categories */}
            <div className="col-span-2 border-r pr-8 space-y-5">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-md" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Skeleton: Brands */}
            <div className="col-span-7 grid grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="space-y-2 ml-1">
                            {[...Array(3)].map((_, j) => (
                                <Skeleton key={j} className="h-3 w-32" />
                            ))}
                            <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skeleton: Best Sellers */}
            <div className="col-span-3 space-y-5">
                <Skeleton className="h-6 w-24" />
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg bg-white border border-gray-100 overflow-hidden">
                            <Skeleton className="h-28 w-full" />
                            <div className="p-2 space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
