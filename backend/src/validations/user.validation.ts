import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdInfo = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: z.string().optional(),
        languagePreferences: z.enum(['en', 'ar']).optional(),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        password: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Confirm password is required'),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

export const addAddressSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, 'Full Name is required'),
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        country: z.string().min(1, 'Country is required'),
        postal_code: z.string().min(1, 'Postal Code is required'),
        phone: z.string().min(1, 'Phone is required'),
    }),
});

export const updateAddressSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
    body: z.object({
        fullName: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postal_code: z.string().optional(),
        phone: z.string().optional(),
    }),
});

export const deleteAddressSchema = z.object({
    params: z.object({
        id: objectIdInfo,
    }),
});

export const addToCartSchema = z.object({
    body: z.object({
        product_id: objectIdInfo,
        quantity: z.number().min(1, 'Quantity must be at least 1'),
    }),
});

export const updateCartSchema = z.object({
    body: z.object({
        product_id: objectIdInfo,
        quantity: z.number().min(1, 'Quantity must be at least 1'),
    }),
});
