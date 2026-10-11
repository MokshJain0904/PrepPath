import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Compass,
  Sparkles,
  Code2,
  Database,
  Terminal,
  Cpu,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Briefcase,
  GraduationCap,
  Layers,
  Loader2,
  Brain,
  Lightbulb,
  Check,
  UserCheck,
  Zap,
} from 'lucide-react';
import api from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

const PRESET_ROLES = [
  { id: 'MERN Full Stack', title: 'MERN Full Stack Developer', icon: Code2, desc: 'React, Node, Express, MongoDB, REST APIs, & State Management' },
  { id: 'Data Analyst', title: 'Data Analyst & ML Practitioner', icon: Database, desc: 'SQL, Python Pandas, Data Visualization, & Statistical Modeling' },
  { id: 'Java Backend', title: 'Java Backend Engineer', icon: Server, desc: 'Core Java, Spring Boot, Microservices, Hibernate, & MySQL' },
  { id: 'Python & AI Engineer', title: 'Python & Generative AI', icon: Cpu, desc: 'Python, PyTorch, LangChain, LLM Fine-Tuning, & Vector DBs' },
  { id: 'DevOps & Cloud', title: 'DevOps & Cloud Engineer', icon: Terminal, desc: 'Docker, Kubernetes, AWS, CI/CD Pipelines, & Terraform' },
  { id: 'Cybersecurity Analyst', title: 'Security Analyst & SOC', icon: ShieldCheck, desc: 'Network Security, SIEM, Penetration Testing, & OWASP Top 10' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'Starting fresh or switching domains. Need strong foundational basics.' },
  { id: 'intermediate', title: 'Intermediate', desc: 'Comfortable with basics. Focus on high-impact projects & DSA.' },
  { id: 'advanced', title: 'Advanced', desc: 'Experienced builder. Focus on advanced patterns, scale, & system design.' },
];

const DURATION_PRESETS = [
  { weeks: 4, label: '4 Weeks', desc: 'Fast-track sprint' },
  { weeks: 8, label: '8 Weeks', desc: 'Recommended (Balanced)' },
  { weeks: 12, label: '12 Weeks', desc: 'Comprehensive mastery' },
  { weeks: 16, label: '16 Weeks', desc: 'Deep dive career switch' },
];

export const OnboardingPage = () => {
  // Step 0 = AI Career Guidance Counselor, Step 1 = Target Role, Step 2 = Experience & Hours, Step 3 = Generating
  const [step, setStep] = useState(0);

  // AI Guidance Consultation Inputs
  const [background, setBackground] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState(null);

  // Roadmap Generation Inputs
  const [field, setField] = useState('MERN Full Stack');
  const [customField, setCustomField] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [targetType, setTargetType] = useState('job');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [totalWeeks, setTotalWeeks] = useState(8);
  const [targetEndDate, setTargetEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const { success, error } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Consult Gemini AI Career Counselor
  const handleConsultAICareerCounselor = async () => {
    setGuidanceLoading(true);
    try {
      const res = await api.post('/plans/career-guidance', {
        background,
        currentSkills,
        interests,
        targetType,
      });

      if (res.data?.success) {
        setGuidanceResult(res.data.data);
        success('AI Career Guidance Counselor analysis completed!');
      }
    } catch (err) {
      error(err.message || 'Failed to fetch AI career guidance');
    } finally {
      setGuidanceLoading(false);
    }
  };

  const handleSelectPathFromGuidance = (path) => {
    setField(path.roleId || path.title);
    if (path.estimatedWeeks) setTotalWeeks(path.estimatedWeeks);
    setStep(1);
    success(`Selected AI Recommended Path: "${path.title}"`);
  };

  const handleNext = () => {
    if (step === 1 && field === 'custom' && !customField.trim()) {
      error('Please enter your custom target role');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setGenerationStep(1);

    const targetField = field === 'custom' ? customField.trim() : field;

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 900);

    try {
      const payload = {
        field: targetField,
        level,
        hoursPerDay: Number(hoursPerDay),
        targetType,
        totalWeeks: Number(totalWeeks),
        targetEndDate: targetEndDate || undefined,
      };

      const res = await api.post('/plans/generate', payload);

      clearInterval(stepInterval);
      setGenerationStep(4);

      if (res.data?.success) {
        await queryClient.invalidateQueries({ queryKey: ['activePlan'] });
        await queryClient.invalidateQueries({ queryKey: ['allTasks'] });
        await queryClient.invalidateQueries({ queryKey: ['todayTasks'] });
        await queryClient.invalidateQueries({ queryKey: ['statsSummary'] });
        await queryClient.invalidateQueries({ queryKey: ['heatmap'] });
        success('Personalized AI Roadmap generated successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      error(err.message || 'Failed to generate roadmap');
    }
  };

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span>
            {step === 0
              ? 'Step 1: AI Career Guidance & Assessment'
              : step === 1
              ? 'Step 2: Target Role & Field Selection'
              : 'Step 3: Availability & Goal Parameters'}
          </span>
          <span>{Math.round(((step + 1) / 3) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800/80">
        {/* Step 0: AI Career Guidance Counselor */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-white shadow-md shadow-brand-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  AI Career Guidance Counselor
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Not sure which path to choose? Share your background and interests to let Gemini AI recommend the best career trajectory for you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Educational / Experience Background
                </label>
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g. 3rd year CS undergrad, Mechanical engineer, Non-tech switcher..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Current Skills & Knowledge
                </label>
                <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="e.g. Basic HTML/CSS, C++, Python syntax, SQL queries..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Primary Interests & Career Goal
              </label>
              <textarea
                rows={2}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Want to build interactive full-stack web applications, work with AI tools, or secure a remote placement within 6 months..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleConsultAICareerCounselor}
                disabled={guidanceLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-accent-500/25 transition-all disabled:opacity-50"
              >
                {guidanceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{guidanceLoading ? 'Consulting Gemini AI...' : 'Analyze & Get AI Guidance'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-500 hover:underline"
              >
                Skip & Choose Preset Role Directly &rarr;
              </button>
            </div>

            {/* AI Guidance Results Display */}
            {guidanceResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-5 animate-fade-in">
                {/* Counselor Advice Box */}
                <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
                      AI Career Mentor Recommendation
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {guidanceResult.counselorAdvice}
                    </p>
                  </div>
                </div>

                {/* Skill Gap Analysis */}
                {guidanceResult.skillGapAnalysis && guidanceResult.skillGapAnalysis.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Key Skill Gaps to Bridge:
                    </div>
                    <ul className="space-y-1 pl-1">
                      {guidanceResult.skillGapAnalysis.map((gap, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Career Path Cards */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Select One of Your Recommended AI Paths:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {guidanceResult.recommendedPaths?.map((path, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 flex flex-col justify-between space-y-3 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              {path.fitScore || 92}% Match
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{path.estimatedWeeks || 8} Wks</span>
                          </div>
                          <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500">
                            {path.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                            {path.reasoning}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectPathFromGuidance(path)}
                          className="w-full py-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-1"
                        >
                          <span>Select This Path</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Target Role / Field */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Confirm your target role
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select from preset engineering disciplines or keep your AI recommended choice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PRESET_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = field === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setField(role.id);
                      setCustomField('');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 shadow-md shadow-brand-500/15 ring-2 ring-brand-500/20'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected
                            ? 'bg-brand-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1">
                        {role.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {role.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Field Input Option */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Or Enter a Custom Role / Topic:
              </label>
              <input
                type="text"
                value={customField}
                onChange={(e) => {
                  setCustomField(e.target.value);
                  if (e.target.value) setField('custom');
                }}
                placeholder="e.g. Flutter Mobile Engineer, Rust Systems Programmer, Solana Web3..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience Level, Goal & Duration */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Experience, Availability & Duration
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure your daily study capacity and target completion pace.
              </p>
            </div>

            {/* Target Type Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                What is your primary placement goal?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTargetType('job')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    targetType === 'job'
                      ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 ring-2 ring-brand-500/20'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-brand-500 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">Full-Time Job</div>
                    <div className="text-[11px] text-slate-500">Placement & career transition</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('internship')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    targetType === 'internship'
                      ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 ring-2 ring-brand-500/20'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-brand-500 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">Internship</div>
                    <div className="text-[11px] text-slate-500">Summer or semester internships</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Current Experience Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 ring-2 ring-brand-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 capitalize">
                        {lvl.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {lvl.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours Slider & Counter */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Daily Study Time
                  </span>
                </div>
                <span className="text-xl font-extrabold font-heading text-brand-500">
                  {hoursPerDay} {hoursPerDay === 1 ? 'Hour' : 'Hours'} / day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>

            {/* Duration Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Roadmap Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DURATION_PRESETS.map((d) => {
                  const isSelected = totalWeeks === d.weeks && !targetEndDate;
                  return (
                    <button
                      key={d.weeks}
                      type="button"
                      onClick={() => {
                        setTotalWeeks(d.weeks);
                        setTargetEndDate('');
                      }}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 ring-2 ring-brand-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">{d.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate AI Roadmap</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-slide-up">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                Generating Your Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customizing day-by-day tasks for <span className="text-brand-500 font-bold">{field === 'custom' ? customField : field}</span>
              </p>
            </div>

            <div className="space-y-3 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className={`flex items-center gap-2.5 text-xs font-semibold ${generationStep >= 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {generationStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                <span>Analyzing domain benchmarks & weightages</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-semibold ${generationStep >= 2 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {generationStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                <span>Computing milestone phase boundaries</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-semibold ${generationStep >= 3 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {generationStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                <span>Synthesizing day-by-day actionable tasks</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-semibold ${generationStep >= 4 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {generationStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                <span>Curating targeted learning & practice links</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
