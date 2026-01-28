"use client"

import React, { useState } from 'react'
import { Sparkles, Send, Loader2, X } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfiniteScrollPagination } from '../../hooks/useInfiniteScrollPagination';
import { useGetAiRecommendationsQuery } from '../../redux/apis/aiApi';

interface Recommendation {
    _id: string;
    name: string;
    description: string;
    image_urls: string[];
    price: number;
    discount_price: number;
    recommendation_reason: string;
    brand_id: {
        _id: string;
        name: string;
    };
    category_id: {
        _id: string;
        name: string;
    };
}

interface AiScentMatchProps {
    onOpen?: () => void;
    trigger?: React.ReactNode;
}

export function AiScentMatch({ onOpen, trigger }: AiScentMatchProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [submittedQuery, setSubmittedQuery] = useState('')

    // Use the custom infinite scroll hook
    const {
        list: recommendations,
        isFetching,
        hasMore,
        observerRef,
        containerRef
    } = useInfiniteScrollPagination<Recommendation>({
        useQueryHook: useGetAiRecommendationsQuery,
        limit: 10,
        search: submittedQuery,
        // Map 'search' to 'query' for the backend if needed, or pass extra args
        extraQueryArgs: { query: submittedQuery }
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        setSubmittedQuery(query)
    }

    // Handle opening
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && onOpen) {
            onOpen();
        } else {
            setQuery('')
            setSubmittedQuery('')
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                {trigger ? trigger : (
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-amber-50/50 hover:bg-amber-100/50 rounded-full border border-amber-200/50 transition-colors cursor-pointer"
                    >
                        <Sparkles size={16} className="text-amber-600" />
                        <span>Find My Scent</span>
                    </button>
                )}
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-2xl bg-white rounded-2xl shadow-2xl z-[260] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">

                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-amber-50 to-white border-b sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="text-primary" />
                                AI Scent Matcher
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <X size={20} />
                                </button>
                            </Dialog.Close>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Describe your vibe, mood, or favorite ingredients (e.g., "romantic dinner date with vanilla" or "fresh gym scent").
                        </p>

                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Describe your dream perfume..."
                                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={isFetching || !query.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isFetching && !recommendations.length ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* Results Area */}
                    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        {isFetching && !recommendations.length && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                                <p className="animate-pulse">Consulting the digital nose...</p>
                            </div>
                        )}

                        {recommendations.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Recommendations</h3>
                                <div className="grid gap-4">
                                    {recommendations.map((product) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={product._id}
                                            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all flex gap-4"
                                        >
                                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.image_urls?.[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-serif font-bold text-gray-900 truncate">{product.name}</h4>
                                                        <p className="text-sm text-gray-500">{product.brand_id?.name}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        {product?.discount_price && product?.discount_price < product?.price && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ₹{product?.price}
                                                            </span>
                                                        )}
                                                        <span className="font-medium text-primary">
                                                            ₹{product?.discount_price ?
                                                                product?.price - product?.discount_price :
                                                                product?.price}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-sm bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-100">
                                                    <span className="font-semibold mr-1">Why:</span>
                                                    {product.recommendation_reason}
                                                </div>

                                                <div className="mt-3 flex justify-end">
                                                    <Link
                                                        href={`/products/${product._id}`}
                                                        className="text-xs font-medium text-gray-900 underline hover:text-primary transition-colors"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        View Product →
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                {/* Observer Triggers */}
                                {hasMore && <div ref={observerRef} className="h-10 w-full flex items-center justify-center">
                                    {isFetching && <Loader2 className="animate-spin text-primary" />}
                                </div>}
                            </div>
                        )}

                        {!isFetching && recommendations.length === 0 && submittedQuery && (
                            <div className="text-center py-12 text-gray-400">
                                <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No matches found. Try a different description.</p>
                            </div>
                        )}

                        {!isFetching && !submittedQuery && (
                            <div className="text-center py-12 text-gray-400">
                                <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Ready to find your perfect scent match</p>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
