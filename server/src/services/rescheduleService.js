import { Task } from '../models/Task.js';
import { Plan } from '../models/Plan.js';

/**
 * Format date object to local YYYY-MM-DD string accurately using local date getters
 */
export function formatDate(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds days to a YYYY-MM-DD string accurately using local calendar math
 */
export function addDays(dateStr, numDays) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + numDays);
  return formatDate(date);
}

export class RescheduleService {
  /**
   * Reschedules all overdue uncompleted tasks (roadmap & custom) directly onto today's date
   * and links them to the user's current active plan.
   */
  static async rescheduleOverdueTasks(userId, planId = null, customToday = null) {
    const todayStr = customToday || formatDate(new Date());

    const planQuery = { userId, status: 'active' };
    if (planId) planQuery._id = planId;
    const plan = await Plan.findOne(planQuery);

    // Find ALL uncompleted tasks for this user from past dates (date strictly less than todayStr)
    // Querying by userId ensures tasks from archived/previous plan versions are also caught and linked
    const overdueTasks = await Task.find({
      userId,
      status: { $in: ['pending', 'skipped'] },
      date: { $lt: todayStr }
    }).sort({ dayNumber: 1, date: 1 });

    const seenKeys = new Set();
    const uniqueOverdueTasks = [];
    const duplicateIdsToDelete = [];

    overdueTasks.forEach((task) => {
      const key = `${task.dayNumber}_${task.title}_${task.description}`;
      if (seenKeys.has(key)) {
        duplicateIdsToDelete.push(task._id);
      } else {
        seenKeys.add(key);
        uniqueOverdueTasks.push(task);
      }
    });

    if (duplicateIdsToDelete.length > 0) {
      await Task.deleteMany({ _id: { $in: duplicateIdsToDelete } });
    }

    if (uniqueOverdueTasks.length === 0) {
      return {
        success: true,
        message: 'No overdue tasks to reschedule. You are completely on track!',
        rescheduledCount: 0,
        plan
      };
    }

    const bulkOps = uniqueOverdueTasks.map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: {
          $set: {
            date: todayStr,
            status: 'pending',
            ...(plan ? { planId: plan._id } : {}),
            originalDate: task.originalDate || task.date
          },
          $inc: { rescheduledCount: 1 }
        }
      }
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }

    // Update plan end date if active plan exists and today exceeds end date
    if (plan && plan.endDate) {
      const endStr = formatDate(new Date(plan.endDate));
      if (todayStr > endStr) {
        plan.endDate = new Date(todayStr);
        await plan.save();
      }
    }

    return {
      success: true,
      message: `Successfully moved ${overdueTasks.length} uncompleted past task(s) onto today's task list (${todayStr}).`,
      rescheduledCount: overdueTasks.length,
      todayStr
    };
  }
}
