import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client.js';
import { TaskCard } from '../components/TaskCard.jsx';
import { TaskModal } from '../components/TaskModal.jsx';
import { triggerConfetti } from '../utils/confetti.js';
import { useToast } from '../context/ToastContext.jsx';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shuffle,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const TodayPage = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);

  // Fetch tasks for the selected date
  const {
    data: taskData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['tasks', selectedDate],
    queryFn: async () => {
      const res = await api.get(`/tasks?date=${selectedDate}`);
      return res.data?.data;
    },
  });

  // Fetch active plan for rescheduling ID
  const { data: planData } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const res = await api.get('/plans/active');
      return res.data?.data;
    },
  });

  const tasks = taskData?.tasks || [];
  const completedCount = taskData?.completedCount || 0;
  const totalTasks = taskData?.totalTasks || 0;
  const totalMinutes = taskData?.totalMinutes || 0;
  const completedMinutes = taskData?.completedMinutes || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Toggle Task Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ taskId, newStatus }) => {
      const res = await api.patch(`/tasks/${taskId}`, { status: newStatus });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['heatmap'] });
      queryClient.invalidateQueries({ queryKey: ['activePlan'] });

      if (variables.newStatus === 'done') {
        const remaining = tasks.filter((t) => t._id !== variables.taskId && t.status !== 'done').length;
        if (remaining === 0) {
          triggerConfetti();
          success('🎉 Outstanding! All tasks completed for today!');
        } else {
          success('Task completed! Keep the streak going.');
        }
      }
    },
    onError: (err) => {
      error(err.message || 'Failed to update task status');
    },
  });

  // Create or Update Custom Task
  const saveTaskMutation = useMutation({
    mutationFn: async (taskPayload) => {
      if (editingTask) {
        const res = await api.patch(`/tasks/${editingTask._id}`, taskPayload);
        return res.data;
      } else {
        const res = await api.post('/tasks', taskPayload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['activePlan'] });
      success(editingTask ? 'Task updated successfully' : 'Custom task added!');
      setEditingTask(null);
    },
    onError: (err) => {
      error(err.message || 'Failed to save task');
    },
  });

  // Delete Task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['statsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['activePlan'] });
      success('Task deleted');
    },
    onError: (err) => {
      error(err.message || 'Failed to delete task');
    },
  });

  // Trigger Adaptive Rescheduling
  const handleReschedule = async () => {
    if (!planData?.plan?._id) return;
    setRescheduling(true);
    try {
      const res = await api.post(`/plans/${planData.plan._id}/reschedule`);
      if (res.data?.success) {
        if (res.data.rescheduledCount > 0) {
          success(`Adaptive engine rescheduled ${res.data.rescheduledCount} overdue task(s) onto today's schedule!`);
          const today = getTodayDateString();
          setSelectedDate(today);
        } else {
          success('No overdue tasks to reschedule. You are on track!');
        }
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        await queryClient.invalidateQueries({ queryKey: ['activePlan'] });
        await queryClient.invalidateQueries({ queryKey: ['statsSummary'] });
        await refetch();
      }
    } catch (err) {
      error(err.message || 'Rescheduling failed');
    } finally {
      setRescheduling(false);
    }
  };

  // Date Navigation Helpers
  const shiftDate = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const isToday = selectedDate === getTodayDateString();

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, t) => {
    const cat = t.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  const formatDateTitle = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Date Header & Nav Bar */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm border flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Date Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center px-2">
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-500" />
              {formatDateTitle(selectedDate)}
            </h2>
            {isToday && (
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-500 mt-0.5">
                Today&apos;s Schedule
              </span>
            )}
          </div>

          <button
            onClick={() => shiftDate(1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="ml-2 text-xs font-bold text-brand-500 hover:underline px-2 py-1 rounded bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Adaptive Reschedule Button */}
          <button
            onClick={handleReschedule}
            disabled={rescheduling}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm disabled:opacity-50"
            title="Redistribute past unfinished tasks into future days"
          >
            <Shuffle className={`w-3.5 h-3.5 text-amber-500 ${rescheduling ? 'animate-spin' : ''}`} />
            <span>{rescheduling ? 'Rescheduling...' : 'Reschedule Past Tasks'}</span>
          </button>

          {/* Add Custom Task */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:bg-brand-600 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Progress & Time Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Completed Count */}
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Tasks Completed</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {completedCount} of {totalTasks} ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Focused Time */}
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Time Investment</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {completedMinutes} / {totalMinutes} mins
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-center space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Daily Completion</span>
            <span className="text-brand-500 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading daily tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border space-y-3">
          <Sparkles className="w-8 h-8 text-brand-500 mx-auto opacity-70" />
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            No Tasks Scheduled for this Date
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enjoy your rest day or add a custom study task to keep your momentum alive!
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([categoryName, catTasks]) => (
            <div key={categoryName} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">
                <Tag className="w-3.5 h-3.5 text-brand-500" />
                <span>{categoryName}</span>
                <span className="text-[10px] text-slate-400">({catTasks.length})</span>
              </div>

              <div className="space-y-3">
                {catTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={(id, status) => toggleStatusMutation.mutate({ taskId: id, newStatus: status })}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsModalOpen(true);
                    }}
                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={(payload) => saveTaskMutation.mutate(payload)}
        task={editingTask}
        defaultDate={selectedDate}
      />
    </div>
  );
};
