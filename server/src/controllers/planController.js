import { Plan } from '../models/Plan.js';
import { Task } from '../models/Task.js';
import { AIService } from '../services/aiService.js';
import { RescheduleService, formatDate, addDays } from '../services/rescheduleService.js';
import { generatePlanSchema, updatePlanSchema } from '../schemas/planSchemas.js';

export const getCareerGuidance = async (req, res, next) => {
  try {
    const { background, currentSkills, interests, targetType } = req.body || {};
    const guidance = await AIService.getCareerGuidance({
      background,
      currentSkills,
      interests,
      targetType,
    });
    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    next(error);
  }
};

export const generatePlan = async (req, res, next) => {
  try {
    const validatedData = generatePlanSchema.parse(req.body);
    const userId = req.user._id;

    // Calculate duration in weeks
    let totalWeeks = validatedData.totalWeeks || 8;
    if (validatedData.targetEndDate) {
      const start = new Date();
      const end = new Date(validatedData.targetEndDate);
      const diffDays = Math.max(7, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      totalWeeks = Math.max(1, Math.min(26, Math.ceil(diffDays / 7)));
    }

    // Archive any currently active plans for this user and clean up uncompleted tasks from old plans
    await Task.deleteMany({ userId, status: { $in: ['pending', 'skipped'] } });
    await Plan.updateMany({ userId, status: 'active' }, { status: 'archived' });

    // Generate AI Roadmap
    const aiResult = await AIService.generateRoadmap({
      field: validatedData.field,
      level: validatedData.level,
      hoursPerDay: validatedData.hoursPerDay,
      targetType: validatedData.targetType,
      totalWeeks,
    });

    const startDate = new Date();
    const startDateStr = formatDate(startDate);
    const totalDays = aiResult.dailyTasks?.length || totalWeeks * 7;
    const endDate = new Date(addDays(startDateStr, totalDays - 1));

    // Save the plan
    const plan = await Plan.create({
      userId,
      field: validatedData.field,
      level: validatedData.level,
      hoursPerDay: validatedData.hoursPerDay,
      targetType: validatedData.targetType,
      startDate,
      endDate,
      totalDays,
      weightage: aiResult.weightage,
      phases: aiResult.phases,
      status: 'active',
    });

    // Batch insert tasks with strict sequential day numbering and deduplication
    const seenTaskKeys = new Set();
    const tasksToInsert = [];

    (aiResult.dailyTasks || []).forEach((t, index) => {
      const dayNum = index + 1;
      const taskDateStr = addDays(startDateStr, dayNum - 1);
      const cleanTitle = t.title ? t.title.replace(/^Day \d+:\s*/i, '') : 'Daily Focus Session';
      const fullTitle = `Day ${dayNum}: ${cleanTitle}`;
      const description = t.description || '';
      const dedupeKey = `${dayNum}_${fullTitle}_${description}`;

      if (!seenTaskKeys.has(dedupeKey)) {
        seenTaskKeys.add(dedupeKey);
        tasksToInsert.push({
          userId,
          planId: plan._id,
          date: taskDateStr,
          dayNumber: dayNum,
          category: t.category || 'Core',
          title: fullTitle,
          description,
          estMinutes: t.estMinutes || Math.round(validatedData.hoursPerDay * 60),
          resourceLinks: t.resourceLinks || [],
          status: 'pending',
          isCustom: false,
        });
      }
    });

    if (tasksToInsert.length > 0) {
      await Task.insertMany(tasksToInsert);
    }

    res.status(201).json({
      success: true,
      message: 'Plan generated successfully',
      data: {
        plan,
        tasksCreated: tasksToInsert.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getActivePlan = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const plan = await Plan.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });

    if (!plan) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    // Compute progress overview
    const totalTasks = await Task.countDocuments({ planId: plan._id });
    const completedTasks = await Task.countDocuments({ planId: plan._id, status: 'done' });
    const pendingTasks = await Task.countDocuments({ planId: plan._id, status: 'pending' });

    // Find current day in plan
    const todayStr = formatDate(new Date());
    const startStr = formatDate(new Date(plan.startDate));
    const dayDiff = Math.max(1, Math.round((new Date(todayStr) - new Date(startStr)) / (1000 * 60 * 60 * 24)) + 1);

    // Current phase
    const currentPhase = plan.phases.find((p) => dayDiff >= p.startDay && dayDiff <= p.endDay) || plan.phases[0];

    res.status(200).json({
      success: true,
      data: {
        plan,
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          currentDay: dayDiff,
          progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          currentPhase,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const validatedData = updatePlanSchema.parse(req.body);
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: validatedData },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

export const reschedulePlan = async (req, res, next) => {
  try {
    const result = await RescheduleService.rescheduleOverdueTasks(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
