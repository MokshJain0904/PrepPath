import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePlanSchema, aiRoadmapOutputSchema } from '../schemas/planSchemas.js';
import { AIService } from '../services/aiService.js';
import { formatDate, addDays } from '../services/rescheduleService.js';

test('Zod Schema: Validates onboarding input accurately', () => {
  const validInput = {
    field: 'MERN Full Stack',
    level: 'intermediate',
    hoursPerDay: 4,
    targetType: 'job',
  };

  const parsed = generatePlanSchema.parse(validInput);
  assert.equal(parsed.field, 'MERN Full Stack');
  assert.equal(parsed.hoursPerDay, 4);

  // Invalid hours per day
  assert.throws(() => {
    generatePlanSchema.parse({
      field: 'Data Science',
      level: 'beginner',
      hoursPerDay: 0, // too low
    });
  });
});

test('AIService: Deterministic Mock generates valid schema output', () => {
  const roadmap = AIService.generateDeterministicMockRoadmap({
    field: 'Data Analyst',
    level: 'beginner',
    hoursPerDay: 3,
    targetType: 'internship',
    totalWeeks: 4,
  });

  assert.ok(roadmap.title.includes('Data Analyst'));
  assert.equal(roadmap.phases.length, 2);
  assert.equal(roadmap.dailyTasks.length, 28); // 4 weeks * 7 days

  // Validate output against Zod schema
  const validated = aiRoadmapOutputSchema.parse({
    title: roadmap.title,
    aiSummary: roadmap.aiSummary,
    weightage: roadmap.weightage,
    phases: roadmap.phases,
    dailyTasks: roadmap.dailyTasks,
  });

  assert.ok(validated);
  const totalWeight = validated.weightage.reduce((s, w) => s + w.percentage, 0);
  assert.equal(totalWeight, 100);
});

test('AIService: Beginner level roadmap starts with web & programming basics', () => {
  const roadmap = AIService.generateDeterministicMockRoadmap({
    field: 'MERN Full Stack',
    level: 'beginner',
    hoursPerDay: 3,
    targetType: 'internship',
    totalWeeks: 8,
  });

  assert.equal(roadmap.dailyTasks.length, 56);
  // Day 1 should start with HTML5 Fundamentals
  assert.ok(roadmap.dailyTasks[0].title.includes('HTML5'));
  // Day 5 should cover JavaScript Variables
  assert.ok(roadmap.dailyTasks[4].title.includes('JavaScript Basics'));
  // Phase 1 should focus on Web & JS Foundations
  assert.ok(roadmap.phases[0].name.includes('Web & JavaScript Programming Foundations'));
});

test('Reschedule Helper: Date math functions correctly', () => {
  const baseDate = '2026-03-01';
  const nextDay = addDays(baseDate, 1);
  assert.equal(nextDay, '2026-03-02');

  const plusSevenDays = addDays(baseDate, 7);
  assert.equal(plusSevenDays, '2026-03-08');

  const minusFiveDays = addDays(baseDate, -5);
  assert.equal(minusFiveDays, '2026-02-24');
});
