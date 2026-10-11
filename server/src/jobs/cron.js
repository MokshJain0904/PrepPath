import cron from 'node-cron';
import { Plan } from '../models/Plan.js';
import { RescheduleService } from '../services/rescheduleService.js';

export const startCronJobs = () => {
  // Run daily at midnight (00:00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Job] Running adaptive rescheduling for all active plans...');
    try {
      const activePlans = await Plan.find({ status: 'active' });
      console.log(`[Cron Job] Found ${activePlans.length} active plans.`);

      for (const plan of activePlans) {
        try {
          const result = await RescheduleService.rescheduleOverdueTasks(plan.userId, plan._id);
          if (result.rescheduledCount > 0) {
            console.log(`[Cron Job] Rescheduled ${result.rescheduledCount} tasks for user ${plan.userId}`);
          }
        } catch (planErr) {
          console.error(`[Cron Job] Error rescheduling for plan ${plan._id}:`, planErr.message);
        }
      }
      console.log('[Cron Job] Completed adaptive rescheduling run.');
    } catch (err) {
      console.error('[Cron Job] Global cron error:', err.message);
    }
  });

  console.log('[Cron] Nightly adaptive rescheduling job scheduled (0 0 * * *)');
};
