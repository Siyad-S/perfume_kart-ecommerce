"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface PaginatedItem {
    _id?: string | number;
    [key: string]: any;
}

interface UseInfiniteScrollPaginationOptions<T> {
    useQueryHook: (args: { skip: number; limit: number; search?: string;[key: string]: any }) => {
        data?: { data?: { data?: T[]; totalCount?: number } };
        isFetching: boolean;
        isLoading: boolean;
        refetch: () => void;
    };
    limit?: number;
    search?: string;
    extraQueryArgs?: Record<string, any>;
}

/** Find nearest scrollable parent */
function getScrollParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;
    let parent = element.parentElement;
    const overflowScrollRegex = /(auto|scroll|overlay)/;

    while (parent) {
        const style = getComputedStyle(parent);
        if (overflowScrollRegex.test(style.overflowY)) return parent;
        parent = parent.parentElement;
    }
    return null;
}

/** Reusable infinite scroll pagination hook */
export function useInfiniteScrollPagination<T extends PaginatedItem>({
    useQueryHook,
    limit = 10,
    search,
    extraQueryArgs = {},
}: UseInfiniteScrollPaginationOptions<T>) {
    const [list, setList] = useState<T[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerInstanceRef = useRef<IntersectionObserver | null>(null);

    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const currentPageRef = useRef(1);

    // Reset pagination when search or extraQueryArgs (filters/sort) change
    // We strive to stable stringify extraQueryArgs to avoid unnecessary resets if object ref changes but content is same
    // simplified for now: dependency on JSON.stringify(extraQueryArgs)
    const queryArgsString = JSON.stringify(extraQueryArgs);

    useEffect(() => {
        setList([]);
        setTotalCount(0);
        setCurrentPage(1);
        currentPageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
    }, [search, queryArgsString]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    // Use RTK Query
    // We merge extraQueryArgs into the query
    const { data, isFetching, isLoading, refetch } = useQueryHook({
        skip: (currentPage - 1) * limit,
        limit,
        search,
        ...extraQueryArgs,
    });

    useEffect(() => {
        isFetchingRef.current = !!isFetching;
    }, [isFetching]);

    /** Handle incoming API data */
    useEffect(() => {
        const newData = data?.data?.data || [];
        const total = data?.data?.totalCount || 0;

        if (!newData.length && totalCount === 0) return;

        setList((prev) => {
            const existingIds = new Set(prev.map((o) => o._id));
            const filtered = newData.filter((o) => !existingIds.has(o._id));
            return [...prev, ...filtered];
        });

        setTotalCount(total);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        setHasMore(currentPageRef.current < totalPages);
    }, [data, limit]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    /** Intersection observer callback */
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && !isFetchingRef.current && hasMoreRef.current) {
                if (currentPageRef.current < totalPages) {
                    setCurrentPage((prev) => {
                        const next = prev + 1;
                        currentPageRef.current = next;
                        return next;
                    });
                } else {
                    setHasMore(false);
                }
            }
        },
        [totalPages]
    );

    /** Setup observer */
    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        if (observerInstanceRef.current) {
            observerInstanceRef.current.disconnect();
            observerInstanceRef.current = null;
        }

        const scrollParent = getScrollParent(containerRef.current ?? target);

        const obs = new IntersectionObserver(handleObserver, {
            root: scrollParent ?? null,
            rootMargin: "300px",
            threshold: 0,
        });

        obs.observe(target);
        observerInstanceRef.current = obs;

        return () => {
            obs.disconnect();
            observerInstanceRef.current = null;
        };
    }, [handleObserver, list.length]);

    /** 🔄 RESET PAGINATION — used after cancelling order */
    const reset = useCallback(() => {
        setList([]);
        setTotalCount(0);
        setCurrentPage(1);
        currentPageRef.current = 1;
        hasMoreRef.current = true;
        setHasMore(true);
        refetch();
    }, [refetch]);

    return {
        list,
        totalCount,
        hasMore,
        isFetching,
        isLoading,
        observerRef,
        containerRef,
        refetch,
        reset,
    };
}
