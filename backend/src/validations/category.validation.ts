import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        image_url: z.string().optional(), // Initially optional or required? Interfaces says string. Let's make it optional assuming defaults or pre-upload. Types say string (required), but let's check controller. Usually it matches image upload. Let's say required if types say so, but usually can be empty initially. I'll make it optional to be safe, or allow empty string.
    }),
});

export const updateCategorySchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        image_url: z.string().optional(),
    }),
});

export const categoryListSchema = z.object({
    body: z.object({
        search: z.string().optional().nullable(),
        page: z.number().optional().nullable(),
        skip: z.number().optional().nullable(),
        limit: z.number().optional().nullable(),
        sort: z.string().optional().nullable(),
        filter: z.record(z.string(), z.any()).optional().nullable(),
    }),
});

export const categoryIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
