import { Skeleton } from "@/src/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="group relative bg-white rounded-2xl p-3 transition-all duration-300 border border-transparent">
            {/* Image Placeholder */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 mb-4">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content Placeholder */}
            <div className="space-y-3 px-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-3/4 bg-neutral-200" />
                        <Skeleton className="h-3 w-1/2 bg-neutral-100" />
                    </div>
                    {/* Price Placeholder */}
                    <Skeleton className="h-5 w-16 bg-neutral-200" />
                </div>
            </div>

            {/* Button Placeholder (Optional, usually hidden until hover but skeleton can show it weakly) */}
            <div className="mt-4">
                <Skeleton className="h-10 w-full rounded-full bg-neutral-100" />
            </div>
        </div>
    );
}

import { cn } from "@/src/lib/utils";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-8", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
