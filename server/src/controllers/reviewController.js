import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { Plan } from '../models/Plan.js';
import { AIService } from '../services/aiService.js';
import { formatDate, addDays } from '../services/rescheduleService.js';

export const getWeeklyReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todayStr = formatDate(new Date());
    const sevenDaysAgoStr = addDays(todayStr, -6);

    const activePlan = await Plan.findOne({ userId, status: 'active' });
    const role = activePlan?.field || 'Software Engineer';

    // Get logs for the past 7 days
    const logs = await ActivityLog.find({
      userId,
      date: { $gte: sevenDaysAgoStr, $lte: todayStr },
    });

    const completedTasks = logs.reduce((sum, l) => sum + (l.completedCount || 0), 0);
    const totalMinutes = logs.reduce((sum, l) => sum + (l.minutesSpent || 0), 0);
    const activeDays = logs.filter((l) => (l.completedCount || 0) > 0).length;

    // Get total assigned tasks for the past 7 days to determine completion rate
    const pastWeekTasks = await Task.find({
      userId,
      date: { $gte: sevenDaysAgoStr, $lte: todayStr },
    });

    const totalAssigned = pastWeekTasks.length;
    const completionRate = totalAssigned > 0 ? Math.min(100, Math.round((completedTasks / totalAssigned) * 100)) : activeDays > 0 ? 80 : 0;

    const review = await AIService.generateWeeklyReview({
      completedTasks,
      totalMinutes,
      activeDays,
      completionRate,
      role,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
