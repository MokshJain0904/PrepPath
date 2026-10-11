import { z } from 'zod';

export const createTaskSchema = z.object({
  planId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  category: z.string().min(1, 'Category is required').default('Custom'),
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().max(1000).default(''),
  estMinutes: z.number().int().min(5).max(480).default(30),
  resourceLinks: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
      })
    )
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).optional(),
  estMinutes: z.number().int().min(5).max(480).optional(),
  status: z.enum(['pending', 'done', 'skipped']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  resourceLinks: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
      })
    )
    .optional(),
});
