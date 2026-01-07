import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

// Common notes schema
const notesSchema = z.object({
    top: z.array(z.string()).optional(),
    middle: z.array(z.string()).optional(),
    base: z.array(z.string()).optional(),
}).optional();

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        brand_id: objectIdInfo,
        price: z.number().min(0, 'Price must be non-negative'),
        discount_price: z.number().min(0, 'Discount price must be non-negative').optional(),
        stock_quantity: z.number().min(0, 'Stock quantity must be non-negative'),
        sku: z.string().min(1, 'SKU is required'),
        notes: notesSchema,
        image_urls: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        banner_url: z.string().optional(),
        category_id: objectIdInfo,
        best_seller: z.boolean().optional(),
        trending: z.boolean().optional(),
        new_launch: z.boolean().optional(),
    }),
});

export const updateProductSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        brand_id: objectIdInfo.optional(),
        price: z.number().optional(),
        discount_price: z.number().optional(),
        stock_quantity: z.number().optional(),
        sku: z.string().optional(),
        notes: notesSchema,
        image_urls: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        banner_url: z.string().optional(),
        category_id: objectIdInfo.optional(),
        best_seller: z.boolean().optional(),
        trending: z.boolean().optional(),
        new_launch: z.boolean().optional(),
    }),
});

export const productListSchema = z.object({
    body: z.object({
        search: z.string().optional(),
        page: z.number().optional().nullable(),
        // Controller: const { skip = null, limit = null ... } = req.body;
        skip: z.number().optional().nullable(),
        limit: z.number().optional().nullable(),
        sort: z.string().optional(),
        filter: z.object({
            category_id: objectIdInfo.optional(),
            brand_id: objectIdInfo.optional(),
            brand: z.array(objectIdInfo).optional(),
            price: z.object({ min: z.number().optional(), max: z.number().optional() }).optional(),
            // dynamic keys
        }).catchall(z.any()).optional(),
    }),
});

export const productIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
