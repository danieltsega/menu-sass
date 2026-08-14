import { z } from 'zod';

export const createDishSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().max(1000).optional(),
  ingredients: z.array(z.string().trim().min(1)).optional(),
  price: z.number().min(0, 'Price must be >= 0').positive('Price must be greater than 0'),
  image: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const reorderDishesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      category: z.string().min(1),
      displayOrder: z.number().int().min(0),
    })
  ).min(1),
});

export const updateDishSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  ingredients: z.array(z.string().trim().min(1)).optional(),
  price: z.number().min(0).positive().optional(),
  image: z.string().max(500).optional(),
  category: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});