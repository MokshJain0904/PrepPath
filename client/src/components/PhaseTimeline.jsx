import React from 'react';
import { Milestone, CheckCircle, Circle, Target, Sparkles } from 'lucide-react';

export const PhaseTimeline = ({ phases = [], currentDay = 1 }) => {
  if (!phases || phases.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-brand-500" />
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Curriculum Phase Milestones
          </h3>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Currently on <span className="text-brand-500 font-bold">Day {currentDay}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase, idx) => {
          const isCurrent = currentDay >= phase.startDay && currentDay <= phase.endDay;
          const isPassed = currentDay > phase.endDay;

          return (
            <div
              key={idx}
              className={`rounded-xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                isCurrent
                  ? 'bg-brand-50/40 dark:bg-brand-950/30 border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/30'
                  : isPassed
                  ? 'bg-slate-50/60 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-900/30 opacity-90'
                  : 'bg-white/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                {/* Header with Day Range & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Day {phase.startDay} &ndash; {phase.endDay}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" /> Active Phase
                    </span>
                  )}
                  {isPassed && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-2.5 h-2.5" /> Completed
                    </span>
                  )}
                </div>

                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white leading-snug mb-1">
                  {phase.name}
                </h4>

                {phase.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                    {phase.description}
                  </p>
                )}

                {/* Goals Checklist */}
                {phase.goals && phase.goals.length > 0 && (
                  <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Key Outcomes:</div>
                    {phase.goals.map((goal, gIdx) => (
                      <div key={gIdx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {isPassed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : isCurrent ? (
                          <Target className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{goal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
