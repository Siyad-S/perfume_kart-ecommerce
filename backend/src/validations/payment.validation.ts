import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

export const verifyPaymentSchema = z.object({
    body: z.object({
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1),
        payment_id: objectIdInfo.optional(), // Sometimes passed, often looked up via order_id in internal logic, but controller has it in body
        payment_status: z.string().optional(),
        error_reason: z.string().optional(),
    }),
});

export const retryPaymentSchema = z.object({
    body: z.object({
        order_id: objectIdInfo,
    }),
});

export const paymentListSchema = z.object({
    body: z.object({
        search: z.string().optional(),
        page: z.number().optional(),
        skip: z.number().optional(),
        limit: z.number().optional(),
        sort: z.string().optional(),
        filter: z.record(z.string(), z.any()).optional(),
    }),
});

export const paymentIdSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});
