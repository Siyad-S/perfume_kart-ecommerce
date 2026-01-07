import { z } from 'zod';

export const contactSupportSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        subject: z.string().optional(),
        message: z.string().min(10, 'Message must be at least 10 characters'),
    }),
});
