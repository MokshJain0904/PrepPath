import { z } from 'zod';

export const onboardingInputSchema = z.object({
  field: z.string().min(2, 'Field or target role is required').max(100),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  hoursPerDay: z.number().min(1, 'At least 1 hour per day required').max(16, 'Maximum 16 hours per day'),
  targetEndDate: z.string().optional().nullable(),
  targetType: z.enum(['internship', 'job']).default('job'),
});

export const weightageItemSchema = z.object({
  category: z.string().min(1),
  percentage: z.number().min(1).max(100),
  reasoning: z.string().min(1),
});

export const phaseItemSchema = z.object({
  name: z.string().min(1),
  startDay: z.number().int().min(1),
  endDay: z.number().int().min(1),
  goals: z.array(z.string().min(1)).min(1),
});

export const taskItemSchema = z.object({
  dayNumber: z.number().int().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  estMinutes: z.number().int().min(5).max(600),
  resourceLinks: z.array(
    z.object({
      title: z.string().min(1),
      url: z.string().url().or(z.string().min(1)),
    })
  ).default([]),
});

export const aiRoadmapOutputSchema = z.object({
  totalDays: z.number().int().min(7).max(365),
  weightage: z.array(weightageItemSchema).min(1),
  phases: z.array(phaseItemSchema).min(1),
  tasks: z.array(taskItemSchema).min(1),
});

export const updatePlanSchema = z.object({
  status: z.enum(['active', 'completed', 'archived']).optional(),
  hoursPerDay: z.number().min(1).max(16).optional(),
});
