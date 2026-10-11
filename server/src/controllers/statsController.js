import { ActivityLog } from '../models/ActivityLog.js';
import { StreakService } from '../services/streakService.js';
import { formatDate } from '../services/rescheduleService.js';

export const getHeatmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();

    const startOfYear = `${year}-01-01`;
    const endOfYear = `${year}-12-31`;

    const logs = await ActivityLog.find({
      userId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const logMap = new Map();
    logs.forEach((log) => {
      logMap.set(log.date, {
        completedCount: log.completedCount || 0,
        minutesSpent: log.minutesSpent || 0,
      });
    });

    // Generate complete days for the year
    const days = [];
    const curr = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31));

    while (curr <= end) {
      const dateStr = curr.toISOString().split('T')[0];
      const data = logMap.get(dateStr) || { completedCount: 0, minutesSpent: 0 };

      // Intensity scale 0 to 4 based on completed count
      let intensity = 0;
      if (data.completedCount >= 5) intensity = 4;
      else if (data.completedCount >= 3) intensity = 3;
      else if (data.completedCount >= 2) intensity = 2;
      else if (data.completedCount >= 1) intensity = 1;

      days.push({
        date: dateStr,
        count: data.completedCount,
        minutes: data.minutesSpent,
        intensity,
      });

      curr.setUTCDate(curr.getUTCDate() + 1);
    }

    res.status(200).json({
      success: true,
      data: {
        year,
        days,
        totalActiveDays: logs.filter((l) => l.completedCount > 0).length,
        totalCompletedTasks: logs.reduce((s, l) => s + (l.completedCount || 0), 0),
        totalMinutes: logs.reduce((s, l) => s + (l.minutesSpent || 0), 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const stats = await StreakService.computeUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
