import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: planData } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const res = await api.get('/plans/active');
      return res.data?.data;
    },
  });

  const plan = planData?.plan;
  const [hours, setHours] = useState(plan?.hoursPerDay || 3);

  const updateHoursMutation = useMutation({
    mutationFn: async (newHours) => {
      if (!plan?._id) return;
      const res = await api.patch(`/plans/${plan._id}`, { hoursPerDay: Number(newHours) });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePlan'] });
      success('Daily availability updated successfully');
    },
    onError: (err) => {
      error(err.message || 'Failed to update plan hours');
    },
  });

  const archivePlanMutation = useMutation({
    mutationFn: async () => {
      if (!plan?._id) return;
      const res = await api.patch(`/plans/${plan._id}`, { status: 'archived' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePlan'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      success('Plan archived. You can now generate a fresh roadmap!');
      navigate('/onboarding');
    },
    onError: (err) => {
      error(err.message || 'Failed to archive plan');
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in">
      <div className="glass-panel rounded-2xl p-6 shadow-sm border flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <SettingsIcon className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Account & Workspace Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your profile, roadmap parameters, and theme preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <div className="glass-panel rounded-2xl p-6 shadow-sm border space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <User className="w-5 h-5 text-brand-500" />
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">User Profile</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{user?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Member Since</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Theme & Display Card */}
        <div className="glass-panel rounded-2xl p-6 shadow-sm border space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            {isDark ? <Moon className="w-5 h-5 text-brand-500" /> : <Sun className="w-5 h-5 text-brand-500" />}
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Appearance & Theme</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</div>
              <div className="text-xs text-slate-400">Switch between dark and light workspace themes</div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">AI Service Engine</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3 h-3" /> Gemini 1.5 / Deterministic Mock
            </span>
          </div>
        </div>

        {/* Plan Configuration */}
        {plan && (
          <div className="glass-panel rounded-2xl p-6 shadow-sm border space-y-4 md:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" />
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Active Roadmap Settings ({plan.field})
                </h3>
              </div>
              <button
                onClick={() => archivePlanMutation.mutate()}
                className="text-xs font-bold text-rose-500 hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Archive & Create New
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Adjust Daily Availability</span>
                  <span className="text-brand-500">{hours} hrs / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => updateHoursMutation.mutate(hours)}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition-all"
                >
                  Save Daily Hours
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PrepPath</span>
        </button>
      </div>
    </div>
  );
};
