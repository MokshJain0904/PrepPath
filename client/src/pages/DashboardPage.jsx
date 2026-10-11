import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { Heatmap } from '../components/Heatmap.jsx';
import { WeightageChart } from '../components/WeightageChart.jsx';
import { PhaseTimeline } from '../components/PhaseTimeline.jsx';
import { WeeklyReviewCard } from '../components/WeeklyReviewCard.jsx';
import {
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = () => {
  // 1. Fetch active plan
  const {
    data: planData,
    isLoading: planLoading,
    error: planError,
  } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const res = await api.get('/plans/active');
      return res.data?.data;
    },
  });

  // 2. Fetch stats & streaks
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['statsSummary'],
    queryFn: async () => {
      const res = await api.get('/stats/summary');
      return res.data?.data;
    },
  });

  // 3. Fetch heatmap data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['heatmap', new Date().getFullYear()],
    queryFn: async () => {
      const res = await api.get(`/stats/heatmap?year=${new Date().getFullYear()}`);
      return res.data?.data;
    },
  });

  const plan = planData?.plan;
  const stats = statsData || {};
  const heatmapDays = heatmapData?.days || [];

  if (planLoading || statsLoading || heatmapLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-9 h-9 animate-spin text-brand-500 mb-3" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading your PrepPath Dashboard...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center glass-panel p-8 rounded-3xl border space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
          No Active Roadmap Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          You haven&apos;t generated a preparation plan yet. Answer a few questions to generate your day-by-day curriculum!
        </p>
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:bg-brand-600 transition-all"
        >
          <span>Start Onboarding Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentDay = planData?.stats?.currentDay || 1;
  const totalDays = plan.totalDays || 60;
  const progressPercent = planData?.stats?.progressPercentage || 0;
  const daysRemaining = Math.max(0, totalDays - currentDay + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Hero Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-700/50">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{plan.targetType === 'internship' ? 'Internship Fast-Track' : 'Job Placement Mastery'}</span>
              <span>&bull;</span>
              <span className="capitalize">{plan.level} Level</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight text-white">
              {plan.field}
            </h1>

            {/* Progress Bar & Day Counter */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>
                  Day <span className="text-emerald-400 font-extrabold">{currentDay}</span> of {totalDays}
                </span>
                <span>{progressPercent}% Tasks Completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 rounded-full shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Action Callouts */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between sm:justify-start gap-4 px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Target Pace</div>
                <div className="text-sm font-extrabold text-white">{plan.hoursPerDay} hrs / day</div>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Days Left</div>
                <div className="text-sm font-extrabold text-emerald-400">{daysRemaining} Days</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/today"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all"
              >
                <span>Go to Today&apos;s Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Change Level / New Plan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Donut Chart & Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeightageChart weightage={plan.weightage} />

        {/* Category Breakdown Progress */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-500" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Category Task Progress
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stats.totalCompletedTasks || 0} / {stats.totalTasksCount || 0} Tasks Done
            </span>
          </div>

          <div className="space-y-4">
            {stats.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 ? (
              Object.entries(stats.categoryBreakdown).map(([cat, info], idx) => {
                const percent = info.total > 0 ? Math.round((info.done / info.total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span className="truncate pr-2">{cat}</span>
                      <span>{info.done} / {info.total} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Start checking tasks on Today&apos;s page to see live category progress meters.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Phase Timeline */}
      <PhaseTimeline phases={plan.phases} currentDay={currentDay} />

      {/* Row 3: Heatmap */}
      <Heatmap
        days={heatmapDays}
        stats={stats}
        year={new Date().getFullYear()}
      />

      {/* Row 4: Weekly AI Review Card */}
      <WeeklyReviewCard />
    </div>
  );
};
