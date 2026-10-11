import React, { useState, useMemo } from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, Clock } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export const Heatmap = ({ days = [], stats = {}, year = new Date().getFullYear(), onYearChange }) => {
  const [tooltip, setTooltip] = useState(null);

  // Group days into 53 weeks (columns) x 7 days (rows)
  const { weeks, monthLabels } = useMemo(() => {
    if (!days || days.length === 0) return { weeks: [], monthLabels: [] };

    const firstDate = new Date(days[0].date + 'T00:00:00Z');
    const startDayOfWeek = firstDate.getUTCDay(); // 0 = Sun, 1 = Mon ...

    const weeksArray = [];
    let currentWeek = [];

    // Pad beginning of first week
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    const mLabels = [];
    let lastMonth = -1;

    days.forEach((day, index) => {
      const d = new Date(day.date + 'T00:00:00Z');
      const month = d.getUTCMonth();

      if (month !== lastMonth) {
        mLabels.push({
          month: MONTH_NAMES[month],
          weekIndex: weeksArray.length,
        });
        lastMonth = month;
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArray.push(currentWeek);
    }

    return { weeks: weeksArray, monthLabels: mLabels };
  }, [days]);

  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case 4:
        return 'bg-emerald-500 dark:bg-emerald-400 border-emerald-600/40 shadow-sm shadow-emerald-500/30';
      case 3:
        return 'bg-emerald-400 dark:bg-emerald-500 border-emerald-500/40';
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-600/80 border-emerald-400/40';
      case 1:
        return 'bg-emerald-100 dark:bg-emerald-800/60 border-emerald-200 dark:border-emerald-700/50';
      case 0:
      default:
        return 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/40';
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Consistency Contribution Grid
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking daily focus minutes and milestone completions across {year}
          </p>
        </div>

        {/* Quick Streak Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Current Streak</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {stats.currentStreak || 0} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
            <Trophy className="w-4 h-4 text-purple-500 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Longest Streak</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {stats.longestStreak || 0} {stats.longestStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Active Days</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {stats.totalActiveDays || 0} Days
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Hours Logged</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {stats.totalHoursLogged || 0} hrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container with Horizontal Scroll */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Month Labels */}
          <div className="flex text-[11px] font-semibold text-slate-400 mb-2 pl-7">
            {monthLabels.map((m, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  left: `${m.weekIndex * 13.5}px`,
                  marginRight: idx < monthLabels.length - 1 ? '0px' : 'auto',
                }}
                className="absolute"
              >
                {m.month}
              </div>
            ))}
          </div>

          {/* Grid Rows (Days 0-6) x Columns (Weeks) */}
          <div className="flex gap-1 pt-4">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 pr-1.5 justify-between text-[9px] font-bold text-slate-400 select-none">
              {DAY_LABELS.map((lbl, idx) => (
                <div key={idx} className="h-2.5 flex items-center leading-none">
                  {lbl}
                </div>
              ))}
            </div>

            {/* Matrix of Squares */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={dIdx} className="w-2.5 h-2.5 rounded-[2.5px] opacity-0" />;
                    }

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            date: day.date,
                            count: day.count,
                            minutes: day.minutes,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className={`w-2.5 h-2.5 rounded-[2.5px] border cursor-pointer transition-all duration-150 hover:scale-125 hover:z-20 ${getIntensityClass(
                          day.intensity
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Footer: Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-[11px]">Consistent daily momentum beats sporadic bursts.</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] mr-1">Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-100 dark:bg-emerald-800/60 border border-emerald-200 dark:border-emerald-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300 dark:bg-emerald-600/80 border border-emerald-400" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-500 border border-emerald-500" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 dark:bg-emerald-400 border border-emerald-600 shadow-sm shadow-emerald-500/30" />
          <span className="text-[11px] ml-1">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
          className="z-50 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-2 rounded-xl shadow-xl text-xs font-medium border border-slate-700 dark:border-slate-300 whitespace-nowrap animate-fade-in"
        >
          <div className="font-bold text-[11px]">{formatDateLabel(tooltip.date)}</div>
          <div className="text-[11px] text-emerald-400 dark:text-emerald-600 font-semibold mt-0.5">
            {tooltip.count > 0 ? `${tooltip.count} tasks completed (${tooltip.minutes} mins)` : 'No tasks recorded'}
          </div>
        </div>
      )}
    </div>
  );
};
