import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5000/api';
let cookieHeader = '';
let activePlanId = '';
let testTaskId = '';

test('E2E: Health Check Endpoint', async () => {
  const res = await fetch(`${BASE_URL}/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'ok');
});

test('E2E: Auth Login & Session Cookie', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@preppath.dev',
      password: 'DemoPassword123!',
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.user.email, 'demo@preppath.dev');

  // Extract set-cookie
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    cookieHeader = setCookie.split(';')[0];
  } else if (data.data.token) {
    cookieHeader = `token=${data.data.token}`;
  }
  assert.ok(cookieHeader);
});

test('E2E: Auth Me (Session Validation)', async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.user.name, 'Alex Rivera');
});

test('E2E: Get Active Roadmap & Phases', async () => {
  const res = await fetch(`${BASE_URL}/plans/active`, {
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.plan);
  assert.equal(data.data.plan.field, 'MERN Full Stack');
  assert.ok(data.data.plan.phases.length >= 2);
  activePlanId = data.data.plan._id;
});

test('E2E: Get Tasks for Today & Toggle Status', async () => {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${BASE_URL}/tasks?date=${today}`, {
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data.tasks));

  if (data.data.tasks.length > 0) {
    const task = data.data.tasks[0];
    testTaskId = task._id;

    // Toggle status to done
    const patchRes = await fetch(`${BASE_URL}/tasks/${testTaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({ status: 'done' }),
    });
    assert.equal(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.equal(patchData.data.task.status, 'done');
  }
});

test('E2E: Create Custom Task', async () => {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({
      date: today,
      category: 'System Design',
      title: 'Practice Redis Cache Eviction & LRU Policies',
      description: 'Review sliding window rate limiting with Redis sorted sets.',
      estMinutes: 45,
      resourceLinks: [{ title: 'Redis Documentation', url: 'https://redis.io' }],
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.task.title, 'Practice Redis Cache Eviction & LRU Policies');
});

test('E2E: Stats Summary & Streaks', async () => {
  const res = await fetch(`${BASE_URL}/stats/summary`, {
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.totalActiveDays > 0);
  assert.ok(data.data.totalMinutesLogged > 0);
});

test('E2E: Heatmap 365-day Matrix', async () => {
  const year = new Date().getFullYear();
  const res = await fetch(`${BASE_URL}/stats/heatmap?year=${year}`, {
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.days.length >= 365);
  assert.ok(data.data.totalActiveDays > 0);
});

test('E2E: Weekly AI Review Synthesis', async () => {
  const res = await fetch(`${BASE_URL}/review/weekly`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.summary);
  assert.ok(Array.isArray(data.data.wins));
  assert.ok(Array.isArray(data.data.recommendations));
});

test('E2E: Adaptive Rescheduling Engine', async () => {
  if (!activePlanId) return;
  const res = await fetch(`${BASE_URL}/plans/${activePlanId}/reschedule`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(typeof data.rescheduledCount === 'number');
});

test('E2E: Vite Frontend Dev Server Delivery', async () => {
  const res = await fetch('http://localhost:5173/');
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes('PrepPath'));
  assert.ok(html.includes('/src/main.jsx'));
});
