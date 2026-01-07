import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

export const createBannerSchema = z.object({
    body: z.object({
        banner_url: z.string().min(1, 'Banner URL is required'),
        product_id: objectIdInfo.optional(),
        category_id: objectIdInfo.optional(),
        banner_text: z.string().optional(),
        description: z.string().optional(),
        home_slider: z.boolean().optional(),
        home_sub: z.boolean().optional(),
        category_listing: z.boolean().optional(),
    }),
});

export const updateBannerSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        banner_url: z.string().optional(),
        product_id: objectIdInfo.optional(),
        category_id: objectIdInfo.optional(),
        banner_text: z.string().optional(),
        description: z.string().optional(),
        home_slider: z.boolean().optional(),
        home_sub: z.boolean().optional(),
        category_listing: z.boolean().optional(),
    }),
});

export const bannerListSchema = z.object({
    body: z.object({
        search: z.string().optional().nullable(),
        page: z.number().optional().nullable(),
        skip: z.number().optional().nullable(),
        limit: z.number().optional().nullable(),
        sort: z.string().optional().nullable(),
        filter: z.record(z.string(), z.any()).optional().nullable(),
    }),
});

export const bannerIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
