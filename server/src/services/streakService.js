import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { Plan } from '../models/Plan.js';

export class StreakService {
  /**
   * Computes current streak, longest streak, total active days, and summary stats
   */
  static async computeUserStats(userId) {
    const logs = await ActivityLog.find({ userId, completedCount: { $gt: 0 } }).sort({ date: 1 });
    const allLogs = await ActivityLog.find({ userId });

    let totalMinutes = 0;
    let totalCompletedTasks = 0;
    for (const log of allLogs) {
      totalMinutes += log.minutesSpent || 0;
      totalCompletedTasks += log.completedCount || 0;
    }

    const activeDaysSet = new Set(logs.map((l) => l.date));
    const totalActiveDays = activeDaysSet.size;

    // Calculate current streak & longest streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;

    if (logs.length > 0) {
      const dates = Array.from(activeDaysSet).sort();

      // Longest streak
      let tempStreak = 0;
      let prevDate = null;

      for (const dStr of dates) {
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const prev = new Date(prevDate + 'T00:00:00Z');
          const curr = new Date(dStr + 'T00:00:00Z');
          const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        prevDate = dStr;
      }

      // Current streak: Walk backwards from today or yesterday
      let checkDate = activeDaysSet.has(today) ? today : activeDaysSet.has(yesterday) ? yesterday : null;
      if (checkDate) {
        let cursor = new Date(checkDate + 'T00:00:00Z');
        while (true) {
          const cStr = cursor.toISOString().split('T')[0];
          if (activeDaysSet.has(cStr)) {
            currentStreak++;
            cursor.setUTCDate(cursor.getUTCDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    // Category breakdown and overall task status
    const allTasks = await Task.find({ userId });
    const totalTasksCount = allTasks.length;
    const completedTasksCount = allTasks.filter((t) => t.status === 'done').length;
    const skippedTasksCount = allTasks.filter((t) => t.status === 'skipped').length;
    const pendingTasksCount = allTasks.filter((t) => t.status === 'pending').length;

    const categoryBreakdown = {};
    for (const t of allTasks) {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { total: 0, done: 0 };
      }
      categoryBreakdown[t.category].total++;
      if (t.status === 'done') {
        categoryBreakdown[t.category].done++;
      }
    }

    const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    return {
      currentStreak,
      longestStreak,
      totalActiveDays,
      totalMinutesLogged: totalMinutes,
      totalHoursLogged: +(totalMinutes / 60).toFixed(1),
      totalCompletedTasks,
      totalTasksCount,
      completedTasksCount,
      skippedTasksCount,
      pendingTasksCount,
      completionRate,
      categoryBreakdown
    };
  }

  /**
   * Generates 365/366 day heatmap data for a given year or the rolling past 365 days
   */
  static async getHeatmapData(userId, year) {
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const startDate = `${targetYear}-01-01`;
    const endDate = `${targetYear}-12-31`;

    const logs = await ActivityLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const logMap = new Map();
    for (const log of logs) {
      logMap.set(log.date, {
        count: log.completedCount,
        minutes: log.minutesSpent
      });
    }

    // Build day-by-day array for the whole year
    const days = [];
    const curr = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    while (curr <= end) {
      const dateStr = curr.toISOString().split('T')[0];
      const data = logMap.get(dateStr) || { count: 0, minutes: 0 };

      // Intensity level 0 to 4
      let level = 0;
      if (data.count >= 6 || data.minutes >= 240) level = 4;
      else if (data.count >= 4 || data.minutes >= 180) level = 3;
      else if (data.count >= 2 || data.minutes >= 90) level = 2;
      else if (data.count >= 1 || data.minutes > 0) level = 1;

      days.push({
        date: dateStr,
        count: data.count,
        minutes: data.minutes,
        level
      });

      curr.setUTCDate(curr.getUTCDate() + 1);
    }

    return {
      year: targetYear,
      totalActivities: logs.reduce((acc, l) => acc + l.completedCount, 0),
      totalMinutes: logs.reduce((acc, l) => acc + l.minutesSpent, 0),
      days
    };
  }
}
