import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md py-8 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-sm tracking-tight text-slate-800 dark:text-slate-200">
            PrepPath &copy; {new Date().getFullYear()}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">&bull; AI Placement & Skill Preparation Engine</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Students & Switchers
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/50">
            <Sparkles className="w-3 h-3" />
            Adaptive Engine
          </div>
        </div>
      </div>
    </footer>
  );
};
