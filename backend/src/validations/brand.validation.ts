import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

export const createBrandSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        logo_url: z.string().optional(),
        description: z.string().optional(),
        origin: z.string().optional(),
    }),
});

export const updateBrandSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        name: z.string().optional(),
        logo_url: z.string().optional(),
        description: z.string().optional(),
        origin: z.string().optional(),
    }),
});

export const brandListSchema = z.object({
    body: z.object({
        search: z.string().optional().nullable(),
        page: z.number().optional().nullable(),
        skip: z.number().optional().nullable(),
        limit: z.number().optional().nullable(),
        sort: z.string().optional().nullable(),
        filter: z.record(z.string(), z.any()).optional().nullable(),
    }),
});

export const brandIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
