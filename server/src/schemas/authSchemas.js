import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  targetRole: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', '']).optional(),
  dailyCommitmentHours: z.number().min(1).max(16).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  targetRole: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', '']).optional(),
  dailyCommitmentHours: z.number().min(1).max(16).optional()
});
