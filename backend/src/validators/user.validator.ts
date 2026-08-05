import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email format').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.enum(['super_admin', 'cafe_admin']),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email('Invalid email format').max(255).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128).optional(),
  role: z.enum(['super_admin', 'cafe_admin']).optional(),
  isActive: z.boolean().optional(),
});