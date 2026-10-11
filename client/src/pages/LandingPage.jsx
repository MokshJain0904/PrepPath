import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Brain,
  Shuffle,
  Trophy,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-500/15 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-500/15 dark:bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
            <span>AI-Driven Placement & Skill Roadmap Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Stop wondering what to study. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-500 via-emerald-400 to-accent-500 bg-clip-text text-transparent">
              Master your preparation daily.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            PrepPath generates a personalized day-by-day curriculum for placements and career switches, tracks your consistency with a contribution heatmap, and adaptively reschedules missed tasks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:scale-105 transition-all duration-200"
            >
              <span>Build My Roadmap</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm transition-all duration-200"
            >
              <span>Explore Demo Account</span>
            </Link>
          </div>

          {/* Key Value Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Personalized JSON Roadmaps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>GitHub-Style Heatmap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Adaptive Rescheduling</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Everything you need to secure your dream role
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Engineered to eliminate cognitive overload and build unbroken study habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                One-Click AI Roadmaps
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Structured day-by-day task lists tailored to your target role, available hours, and skill depth with curated learning links.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                12-Month Heatmap & Streaks
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visual proof of consistency. Watch your grid turn deep emerald as you log productive hours and maintain multi-week streaks.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Adaptive Rescheduler
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Missed a day? Nightly cron algorithms automatically redistribute unfinished tasks into future slots without overloading your schedule.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Weekly AI Review
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get high-impact feedback, win highlights, and pinpointed gap analysis calculated directly from your past 7 days of performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl">
            Start preparing with absolute clarity today
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            Join thousands of focused learners who replaced aimless browsing with disciplined execution.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-emerald-900 font-bold text-sm sm:text-base shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all"
          >
            <span>Create Your Free Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
