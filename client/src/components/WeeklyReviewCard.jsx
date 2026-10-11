import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Quote,
  TrendingUp,
} from 'lucide-react';
import api from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

export const WeeklyReviewCard = ({ initialReview = null }) => {
  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleFetchReview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/review/weekly');
      if (res.data?.success) {
        setReview(res.data.data);
        success('Generated fresh AI performance review!');
      }
    } catch (err) {
      error(err.message || 'Failed to generate weekly review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-accent-600 to-purple-400 text-white shadow-md shadow-accent-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Weekly AI Mentor Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized insights and tactical guidance synthesized from your last 7 days
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchReview}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-500' : ''}`} />
          {loading ? 'Analyzing...' : review ? 'Refresh Insights' : 'Generate Review'}
        </button>
      </div>

      {!review && !loading ? (
        <div className="text-center py-6">
          <Sparkles className="w-8 h-8 text-accent-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Ready for your weekly performance breakdown?
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Our AI mentor synthesizes your task activity into high-leverage recommendations.
          </p>
          <button
            onClick={handleFetchReview}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all"
          >
            Run Weekly Analysis
          </button>
        </div>
      ) : review ? (
        <div className="space-y-4 animate-fade-in">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-accent-50/50 dark:bg-accent-950/30 border border-accent-200/60 dark:border-accent-800/50 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent-600 dark:text-accent-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {review.summary}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wins Column */}
            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Trophy className="w-4 h-4 text-emerald-500" />
                Key Wins
              </div>
              <ul className="space-y-1.5">
                {(review.wins || []).map((win, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gap Analysis Column */}
            <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Focus Gaps
              </div>
              <div className="space-y-2">
                {(review.gapAnalysis || []).map((gap, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>{gap.area}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          gap.severity === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{gap.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Column */}
            <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                <Lightbulb className="w-4 h-4 text-purple-500" />
                Action Tips
              </div>
              <div className="space-y-2">
                {(review.recommendations || []).map((rec, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>{rec.title}</span>
                      <span className="text-[9px] uppercase font-bold text-accent-500 bg-accent-50 dark:bg-accent-950 px-1.5 py-0.2 rounded">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{rec.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inspirational Quote */}
          {review.quote && (
            <div className="flex items-center gap-2 text-xs italic text-slate-500 dark:text-slate-400 justify-center pt-2">
              <Quote className="w-3.5 h-3.5 text-slate-400" />
              <span>&ldquo;{review.quote}&rdquo;</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
