import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as ChartIcon } from 'lucide-react';

const COLORS = ['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'];

export const WeightageChart = ({ weightage = [] }) => {
  if (!weightage || weightage.length === 0) return null;

  const data = weightage.map((item) => ({
    name: item.category,
    value: item.percentage,
    reasoning: item.reasoning,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 p-3 rounded-xl shadow-xl text-xs border border-slate-700 max-w-xs">
          <div className="font-bold flex items-center justify-between gap-2">
            <span>{d.name}</span>
            <span className="text-brand-400 dark:text-brand-600 font-extrabold">{d.value}%</span>
          </div>
          {d.reasoning && <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">{d.reasoning}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <ChartIcon className="w-5 h-5 text-brand-500" />
        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
          Preparation Weightage Split
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        {/* Recharts Donut */}
        <div className="h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">100%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Split</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
