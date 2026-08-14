import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(500).optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const reorderCategoriesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      displayOrder: z.number().int().min(0),
    })
  ).min(1),
});