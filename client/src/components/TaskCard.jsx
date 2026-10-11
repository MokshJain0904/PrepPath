import React, { useState } from 'react';
import {
  Check,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const CATEGORY_COLORS = {
  'Frontend (React & UI)': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
  'Backend (Node & Express)': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  'Database (MongoDB)': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800',
  'DSA & System Design': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  'Core Concepts & Fundamentals': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  'Custom': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  default: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
};

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isDone = task.status === 'done';
  const isSkipped = task.status === 'skipped';

  const categoryStyle = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.default;

  return (
    <div
      className={`glass-panel rounded-xl p-4 sm:p-5 transition-all duration-200 border ${
        isDone
          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 opacity-90'
          : isSkipped
          ? 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
          : 'hover:border-brand-400/50 dark:hover:border-brand-600/50 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Interactive Checkbox */}
        <button
          onClick={() => onToggleStatus(task._id, isDone ? 'pending' : 'done')}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
            isDone
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600 scale-105'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-900'
          }`}
        >
          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}
            >
              <Tag className="w-2.5 h-2.5" />
              {task.category}
            </span>

            {/* Time Estimate Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              <Clock className="w-3 h-3 text-slate-400" />
              {task.estMinutes} mins
            </span>

            {task.isCustom && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                Custom
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            onClick={() => setExpanded(!expanded)}
            className={`font-semibold text-sm sm:text-base leading-snug cursor-pointer transition-colors ${
              isDone
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400'
            }`}
          >
            {task.title}
          </h4>

          {/* Collapsible Details: Description & Resources */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fade-in">
              {task.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Resource Links */}
              {task.resourceLinks && task.resourceLinks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Recommended Resources
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.resourceLinks.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:underline transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {res.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {task.isCustom && onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
