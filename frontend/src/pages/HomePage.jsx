import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Globe,
  FileCheck2,
  ShieldCheck,
  FolderKanban,
  Code2,
  Sparkles,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function HomePage({ onNavigate, savedCount }) {
  const { t, isDark, isArabic } = usePreferences();

  const capabilities = [
    {
      title: t.cap1Title,
      desc: t.cap1Desc,
      icon: BrainCircuit,
      accent: isDark
        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
        : 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    {
      title: t.cap2Title,
      desc: t.cap2Desc,
      icon: Globe,
      accent: isDark
        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
        : 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      title: t.cap3Title,
      desc: t.cap3Desc,
      icon: ShieldCheck,
      accent: isDark
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: t.cap4Title,
      desc: t.cap4Desc,
      icon: FileCheck2,
      accent: isDark
        ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
        : 'text-sky-700 bg-sky-50 border-sky-200',
    },
  ];

  const workflowSteps = [
    t.stepPlanner,
    t.stepSearcher,
    t.stepReader,
    t.stepAnalyst,
    t.stepWriter,
  ];

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section
        className={`relative overflow-hidden border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800 shadow-black/40'
            : 'bg-gradient-to-br from-white via-slate-50 to-cyan-50/60 border-slate-200 shadow-slate-200/70'
        }`}
      >
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-400/25 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{t.heroBadge}</span>
          </div>

          <h1
            className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.heroTitlePrefix}{' '}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? 'from-cyan-300 via-sky-400 to-indigo-400'
                  : 'from-cyan-700 via-sky-600 to-indigo-600'
              }`}
            >
              {t.heroTitleHighlight}
            </span>
          </h1>

          <p
            className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('research')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{t.launchStudio}</span>
              <ArrowIcon className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('history')}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'text-slate-200 bg-slate-800/90 hover:bg-slate-800 border-slate-700'
                  : 'text-slate-800 bg-white hover:bg-slate-100 border-slate-200'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>
                {t.viewArchive} ({savedCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('developer')}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-900 border-slate-800'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70 border-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{t.developerBtn}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Strip */}
        <div
          className={`mt-8 sm:mt-10 pt-5 sm:pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200/80'
          }`}
        >
          <span
            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {t.pipelineLabel}
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {workflowSteps.map((step) => (
              <span
                key={step}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-mono ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800 text-cyan-300'
                    : 'bg-white border-slate-200 text-cyan-700'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {capabilities.map(({ title, desc, icon: Icon, accent }) => (
          <div
            key={title}
            className={`border rounded-2xl p-5 sm:p-6 shadow-lg transition space-y-2.5 sm:space-y-3 min-w-0 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center ${accent}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h2
              className={`text-base sm:text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}