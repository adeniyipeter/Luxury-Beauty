import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    name: z.string().min(2, 'Service name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    durationMinutes: z.number().int().min(15, 'Duration must be at least 15 minutes'),
    price: z.number().positive('Price must be greater than 0'),
    imageUrl: z.string().url().optional().or(z.literal('')),
    preparation: z.string().optional(),
    aftercare: z.string().optional(),
    isDisclaimerRequired: z.boolean().optional().default(false),
    disclaimerText: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    durationMinutes: z.number().int().min(15).optional(),
    price: z.number().positive().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    preparation: z.string().optional(),
    aftercare: z.string().optional(),
    isDisclaimerRequired: z.boolean().optional(),
    disclaimerText: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    sortOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});
