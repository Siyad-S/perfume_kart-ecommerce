import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

const shippingAddressSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postal_code: z.string().min(1, "Postal Code is required"),
    phone: z.string().min(1, "Phone is required"),
});

const orderedItemSchema = z.object({
    product_id: objectIdInfo,
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
});

export const createOrderSchema = z.object({
    body: z.object({
        user_id: objectIdInfo.optional(), // Usually checked via token, but controller reads from body
        total_amount: z.number().positive(),
        status: z.enum(['pending', 'completed', 'cancelled']).optional(),
        shipping_address: shippingAddressSchema,
        ordered_items: z.array(orderedItemSchema).min(1, "Order must have at least one item"),
        currency: z.string().optional(),
    }),
});

export const updateOrderSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'confirmed']),
    }),
});

export const orderListSchema = z.object({
    body: z.object({
        search: z.string().optional().nullable(),
        page: z.number().optional().nullable(),
        skip: z.number().optional().nullable(),
        limit: z.number().optional().nullable(),
        sort: z.string().optional().nullable(),
        filter: z.record(z.string(), z.any()).optional().nullable(),
    }),
});

export const orderIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
