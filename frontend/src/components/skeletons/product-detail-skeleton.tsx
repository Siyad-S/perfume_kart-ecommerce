import { Skeleton } from "@/src/components/ui/skeleton";

export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs Skeleton */}
            <div className="border-b border-neutral-100 sticky top-0 z-20 bg-white/80">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <Skeleton className="h-5 w-48 bg-neutral-200" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Image Gallery Skeleton */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <div className="flex gap-4 pb-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Right: Info Skeleton */}
                    <div className="flex flex-col h-fit space-y-8">
                        {/* Title & Reviews */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-10 w-3/4" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t border-neutral-100">
                            <Skeleton className="h-12 w-32 rounded-full" /> {/* Qty */}
                            <Skeleton className="h-12 flex-1 rounded-full" /> {/* Add to cart */}
                            <Skeleton className="h-12 flex-1 rounded-full" /> {/* Buy now */}
                        </div>

                        {/* Accordion */}
                        <div className="space-y-4 mt-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
