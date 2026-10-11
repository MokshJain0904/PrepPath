import { z } from 'zod';

export const weeklyReviewOutputSchema = z.object({
  period: z.string(),
  summary: z.string(),
  completionRate: z.number(),
  hoursLogged: z.number(),
  wins: z.array(z.string()),
  gapAnalysis: z.array(
    z.object({
      area: z.string(),
      observation: z.string(),
      severity: z.enum(['low', 'medium', 'high'])
    })
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      action: z.string(),
      priority: z.enum(['urgent', 'important', 'bonus'])
    })
  ),
  quote: z.string()
});
