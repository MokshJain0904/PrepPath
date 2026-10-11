import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { Plan } from '../models/Plan.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchemas.js';
import { formatDate } from '../services/rescheduleService.js';

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { date, startDate, endDate, planId } = req.query;

    const query = { userId };
    if (planId) query.planId = planId;

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      query.date = formatDate(new Date());
    }

    const tasks = await Task.find(query).sort({ dayNumber: 1, date: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        date: query.date,
        tasks,
        totalTasks: tasks.length,
        completedCount: tasks.filter((t) => t.status === 'done').length,
        totalMinutes: tasks.reduce((sum, t) => sum + (t.estMinutes || 0), 0),
        completedMinutes: tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + (t.estMinutes || 0), 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const userId = req.user._id;

    // Associate with active plan if not provided
    let planId = validatedData.planId;
    let dayNumber = 1;
    if (!planId) {
      const activePlan = await Plan.findOne({ userId, status: 'active' });
      if (activePlan) {
        planId = activePlan._id;
        const startStr = formatDate(new Date(activePlan.startDate));
        const diff = Math.max(1, Math.round((new Date(validatedData.date) - new Date(startStr)) / (1000 * 60 * 60 * 24)) + 1);
        dayNumber = diff;
      }
    }

    const task = await Task.create({
      userId,
      planId,
      date: validatedData.date,
      dayNumber,
      category: validatedData.category || 'Custom',
      title: validatedData.title,
      description: validatedData.description || '',
      estMinutes: validatedData.estMinutes || 30,
      resourceLinks: validatedData.resourceLinks || [],
      status: 'pending',
      isCustom: true,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const userId = req.user._id;
    const { id } = req.params;

    const existingTask = await Task.findOne({ _id: id, userId });
    if (!existingTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = existingTask.status;
    const oldMinutes = existingTask.estMinutes || 0;
    const taskDate = existingTask.date;

    // Apply updates
    Object.assign(existingTask, validatedData);

    if (validatedData.status === 'done' && oldStatus !== 'done') {
      existingTask.completedAt = new Date();
      // Update ActivityLog
      await ActivityLog.findOneAndUpdate(
        { userId, date: taskDate },
        {
          $inc: {
            completedCount: 1,
            minutesSpent: existingTask.estMinutes || 30,
          },
        },
        { upsert: true, new: true }
      );
    } else if (oldStatus === 'done' && validatedData.status && validatedData.status !== 'done') {
      existingTask.completedAt = null;
      // Decrement ActivityLog
      await ActivityLog.findOneAndUpdate(
        { userId, date: taskDate },
        {
          $inc: {
            completedCount: -1,
            minutesSpent: -oldMinutes,
          },
        },
        { new: true }
      );
    }

    await existingTask.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: existingTask },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // If deleting a done task, decrement ActivityLog
    if (task.status === 'done') {
      await ActivityLog.findOneAndUpdate(
        { userId, date: task.date },
        {
          $inc: {
            completedCount: -1,
            minutesSpent: -(task.estMinutes || 0),
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
