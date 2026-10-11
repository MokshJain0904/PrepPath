import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import {
  Map,
  Search,
  Filter,
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const PlanOverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [collapsedPhases, setCollapsedPhases] = useState({});

  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const res = await api.get('/plans/active');
      return res.data?.data;
    },
  });

  const { data: taskData, isLoading: tasksLoading } = useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      // Fetch all tasks for active plan
      const res = await api.get('/tasks?startDate=2000-01-01&endDate=2099-12-31');
      return res.data?.data?.tasks || [];
    },
  });

  const plan = planData?.plan;
  const tasks = taskData || [];

  const togglePhase = (phaseNum) => {
    setCollapsedPhases((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  if (planLoading || tasksLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-9 h-9 animate-spin text-brand-500 mb-3" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Full Preparation Roadmap...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center glass-panel p-8 rounded-3xl border space-y-4">
        <Map className="w-10 h-10 text-brand-500 mx-auto" />
        <h2 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
          No Active Plan Found
        </h2>
        <Link
          to="/onboarding"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md"
        >
          Generate New Roadmap
        </Link>
      </div>
    );
  }

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...new Set(tasks.map((t) => t.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-brand-500" />
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Full Roadmap & Curriculum
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {plan.field} &bull; {plan.totalDays} Total Days &bull; {plan.phases.length} Structured Phases &bull; <span className="font-semibold text-brand-500 capitalize">{plan.level} Level</span>
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Change Level / New Plan</span>
          </Link>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics, DSA, React..."
              className="w-full sm:w-60 pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phases Accordions */}
      <div className="space-y-6">
        {plan.phases.map((phase) => {
          const phaseNum = phase.phaseNumber || 1;
          const isCollapsed = collapsedPhases[phaseNum];
          const phaseTasks = filteredTasks
            .filter((t) => t.dayNumber >= phase.startDay && t.dayNumber <= phase.endDay)
            .sort((a, b) => a.dayNumber - b.dayNumber);
          const completedInPhase = phaseTasks.filter((t) => t.status === 'done').length;

          return (
            <div
              key={phaseNum}
              className="glass-panel rounded-2xl shadow-sm border overflow-hidden transition-all duration-200"
            >
              {/* Accordion Phase Header */}
              <div
                onClick={() => togglePhase(phaseNum)}
                className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                      Day {phase.startDay} &ndash; {phase.endDay}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      ({completedInPhase} / {phaseTasks.length} Completed)
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {phase.name}
                  </h3>
                </div>

                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>
              </div>

              {/* Tasks in Phase */}
              {!isCollapsed && (
                <div className="p-5 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {phaseTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No tasks matched your search or filter criteria in this phase.
                    </p>
                  ) : (
                    phaseTasks.map((t) => {
                      const isDone = t.status === 'done';
                      return (
                        <div key={t._id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {!isDone && <span className="text-[10px] font-bold">{t.dayNumber}</span>}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-400">Day {t.dayNumber}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {t.category}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {t.estMinutes}m
                                </span>
                              </div>
                              <h4
                                className={`text-sm font-semibold ${
                                  isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {t.title}
                              </h4>
                              {t.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.description}</p>
                              )}
                            </div>
                          </div>

                          {t.resourceLinks && t.resourceLinks.length > 0 && (
                            <a
                              href={t.resourceLinks[0].url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-brand-500 hover:underline shrink-0"
                            >
                              <BookOpen className="w-3 h-3" /> Resource
                            </a>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
