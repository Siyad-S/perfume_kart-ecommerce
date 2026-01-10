import { Skeleton } from "@/src/components/ui/skeleton";

export function CategorySkeleton() {
    return (
        <div className="relative group overflow-hidden rounded-2xl h-[300px] md:h-[400px] w-full bg-neutral-100">
            <Skeleton className="h-full w-full absolute inset-0" />

            {/* Overlay Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Content Placeholder at Bottom */}
            <div className="absolute bottom-0 left-0 p-8 w-full space-y-3">
                <Skeleton className="h-8 w-3/4 bg-white/30" />
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="h-4 w-2/3 bg-white/20" />
                <div className="pt-2">
                    <Skeleton className="h-6 w-24 bg-white/30 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function CategoryGridSkeleton({ count }: { count: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CategorySkeleton key={i} />
            ))}
        </div>
    );
}
