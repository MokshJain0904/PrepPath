import { z } from 'zod';

export const createTaskSchema = z.object({
  planId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional().default(''),
  estMinutes: z.number().min(5).max(720).default(60),
  resourceLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        type: z.enum(['documentation', 'article', 'video', 'practice', 'github', 'other']).default('article'),
      })
    )
    .optional()
    .default([]),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'done', 'skipped']),
  actualMinutes: z.number().optional(),
});

export const updateTaskDetailsSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  estMinutes: z.number().min(5).max(720).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  resourceLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        type: z.enum(['documentation', 'article', 'video', 'practice', 'github', 'other']).default('article'),
      })
    )
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  estMinutes: z.number().min(5).max(720).optional(),
  status: z.enum(['pending', 'done', 'skipped']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  resourceLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        type: z.enum(['documentation', 'article', 'video', 'practice', 'github', 'other']).default('article'),
      })
    )
    .optional(),
});
