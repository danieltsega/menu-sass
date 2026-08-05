import { z } from 'zod';

export const createCafeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  slug: z.string().trim().min(1, 'Slug is required').max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  admin: z.string().min(1, 'Admin user ID is required'),
  logo: z.string().max(500).optional(),
  description: z.string().trim().max(500).optional(),
  address: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(30).optional(),
});

export const updateCafeSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z.string().trim().min(1).max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  logo: z.string().max(500).optional(),
  description: z.string().trim().max(500).optional(),
  address: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(30).optional(),
  isActive: z.boolean().optional(),
});