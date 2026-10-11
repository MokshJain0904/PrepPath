import { z } from 'zod';

export const generatePlanSchema = z.object({
  field: z.string().min(2, 'Field/Role is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  hoursPerDay: z.number().min(1, 'Minimum 1 hour per day').max(16, 'Maximum 16 hours per day'),
  targetType: z.enum(['internship', 'job', 'skill_mastery']).default('job'),
  totalWeeks: z.number().min(1).max(24).default(8),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  currentSkills: z.array(z.string()).optional(),
  focusAreas: z.array(z.string()).optional()
});

export const updatePlanSchema = z.object({
  title: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  hoursPerDay: z.number().min(1).max(16).optional()
});

export const aiRoadmapOutputSchema = z.object({
  title: z.string(),
  aiSummary: z.string(),
  weightage: z.array(
    z.object({
      category: z.string(),
      percentage: z.number(),
      reasoning: z.string()
    })
  ),
  phases: z.array(
    z.object({
      phaseNumber: z.number(),
      name: z.string(),
      description: z.string(),
      startDay: z.number(),
      endDay: z.number(),
      goals: z.array(z.string())
    })
  ),
  dailyTasks: z.array(
    z.object({
      dayNumber: z.number(),
      phaseNumber: z.number().default(1),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      estMinutes: z.number(),
      resourceLinks: z.array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(['documentation', 'article', 'video', 'practice', 'github', 'other']).default('article')
        })
      )
    })
  )
});
