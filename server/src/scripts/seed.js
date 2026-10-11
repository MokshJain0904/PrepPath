import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Plan } from '../models/Plan.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { config } from '../config/env.js';
import { AIService } from '../services/aiService.js';
import { formatDate, addDays } from '../services/rescheduleService.js';

async function seed() {
  console.log('🌱 Starting PrepPath Database Seed...');
  await mongoose.connect(config.mongoUri);

  // Clean old demo data
  const demoEmail = 'demo@preppath.dev';
  const existingUser = await User.findOne({ email: demoEmail });
  if (existingUser) {
    console.log('🧹 Cleaning existing demo user data...');
    await Task.deleteMany({ userId: existingUser._id });
    await Plan.deleteMany({ userId: existingUser._id });
    await ActivityLog.deleteMany({ userId: existingUser._id });
    await User.deleteOne({ _id: existingUser._id });
  }

  // Create demo user
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('DemoPassword123!', salt);
  const demoUser = await User.create({
    name: 'Alex Rivera',
    email: demoEmail,
    passwordHash,
  });
  console.log(`👤 Created Demo User: ${demoUser.email} (Password: DemoPassword123!)`);

  // Generate 60-day MERN roadmap
  const roadmap = AIService.generateDeterministicMockRoadmap({
    field: 'MERN Full Stack',
    level: 'intermediate',
    hoursPerDay: 3,
    targetType: 'job',
    totalWeeks: 8,
  });

  const todayStr = formatDate(new Date());
  // Start plan 14 days ago so today is day 15, right in Phase 2
  const startDateStr = addDays(todayStr, -14);
  const startDate = new Date(startDateStr + 'T00:00:00Z');
  const endDate = new Date(addDays(startDateStr, roadmap.dailyTasks.length - 1) + 'T00:00:00Z');

  const plan = await Plan.create({
    userId: demoUser._id,
    field: 'MERN Full Stack',
    level: 'intermediate',
    hoursPerDay: 3,
    targetType: 'job',
    startDate,
    endDate,
    totalDays: roadmap.dailyTasks.length,
    weightage: roadmap.weightage,
    phases: roadmap.phases,
    status: 'active',
  });

  console.log(`📋 Created Active Plan: "${plan.field}" with ${roadmap.phases.length} phases.`);

  // Create tasks
  const tasksToInsert = roadmap.dailyTasks.map((t) => {
    const taskDateStr = addDays(startDateStr, t.dayNumber - 1);
    const isPast = taskDateStr < todayStr;
    const isToday = taskDateStr === todayStr;

    // Past tasks mostly done, some skipped, 1 overdue to test rescheduling
    let status = 'pending';
    let completedAt = null;

    if (isPast) {
      if (t.dayNumber === 12) {
        status = 'pending'; // Overdue task for testing reschedule!
      } else if (t.dayNumber % 7 === 0) {
        status = 'skipped';
      } else {
        status = 'done';
        completedAt = new Date(taskDateStr + 'T18:30:00Z');
      }
    } else if (isToday) {
      status = 'pending';
    }

    return {
      userId: demoUser._id,
      planId: plan._id,
      date: taskDateStr,
      dayNumber: t.dayNumber,
      category: t.category,
      title: t.title,
      description: t.description,
      estMinutes: t.estMinutes,
      resourceLinks: t.resourceLinks,
      status,
      isCustom: false,
      completedAt,
    };
  });

  // Add 1 custom task for today
  tasksToInsert.push({
    userId: demoUser._id,
    planId: plan._id,
    date: todayStr,
    dayNumber: 15,
    category: 'Custom Practice',
    title: 'Review System Design Primer & Cache Strategies',
    description: 'Quick evening revision on LRU cache and Redis eviction policies.',
    estMinutes: 45,
    resourceLinks: [{ title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }],
    status: 'pending',
    isCustom: true,
  });

  await Task.insertMany(tasksToInsert);
  console.log(`✅ Inserted ${tasksToInsert.length} tasks.`);

  // Seed 90 days of ActivityLogs for rich Heatmap rendering
  const logsToInsert = [];
  for (let i = 90; i >= 1; i--) {
    const logDateStr = addDays(todayStr, -i);
    // Give realistic distribution (active 5-6 days a week, varying intensity 1-4)
    const dayOfWeek = new Date(logDateStr + 'T00:00:00Z').getUTCDay();
    const isRestDay = dayOfWeek === 0 && i % 3 === 0;

    if (!isRestDay) {
      const taskCount = (i % 4) + 1; // 1 to 4 tasks
      const minutesSpent = taskCount * 45 + (i % 30);
      logsToInsert.push({
        userId: demoUser._id,
        date: logDateStr,
        completedCount: taskCount,
        minutesSpent,
      });
    }
  }

  await ActivityLog.insertMany(logsToInsert);
  console.log(`🔥 Seeded ${logsToInsert.length} days of ActivityLog history for Heatmap.`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Login credentials for demo:');
  console.log(`Email:    ${demoEmail}`);
  console.log(`Password: DemoPassword123!`);
  console.log('----------------------------------------------------\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
