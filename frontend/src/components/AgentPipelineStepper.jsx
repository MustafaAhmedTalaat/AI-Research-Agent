import React, { useEffect, useState } from 'react';
import { BrainCircuit, Globe, BookOpenCheck, BarChart2, PenTool } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function AgentPipelineStepper({ isRunning }) {
  const { t, isDark } = usePreferences();
  const [activeIndex, setActiveIndex] = useState(0);

  const stages = [
    {
      key: 'planner',
      title: t.stepPlanner,
      desc: t.cap1Desc,
      icon: BrainCircuit,
    },
    {
      key: 'searcher',
      title: t.stepSearcher,
      desc: t.cap2Desc,
      icon: Globe,
    },
    {
      key: 'reader',
      title: t.stepReader,
      desc: t.researchSub,
      icon: BookOpenCheck,
    },
    {
      key: 'analyst',
      title: t.stepAnalyst,
      desc: t.cap3Desc,
      icon: BarChart2,
    },
    {
      key: 'writer',
      title: t.stepWriter,
      desc: t.cap4Desc,
      icon: PenTool,
    },
  ];

  useEffect(() => {
    if (!isRunning) {
      setActiveIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(timer);
  }, [isRunning, stages.length]);

  if (!isRunning) return null;

  return (
    <div
      className={`border rounded-2xl p-4 sm:p-6 mb-8 shadow-xl transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-cyan-500/20'
          : 'bg-white border-cyan-200 shadow-slate-200/70'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <h3
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider truncate ${
              isDark ? 'text-cyan-300' : 'text-cyan-700'
            }`}
          >
            {t.livePipeline}
          </h3>
        </div>
        <span
          className={`text-xs font-mono shrink-0 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {t.stage} {activeIndex + 1} / {stages.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={stage.key}
              className={`rounded-xl p-3.5 border transition-all min-w-0 ${
                isCurrent
                  ? isDark
                    ? 'bg-cyan-950/40 border-cyan-400/50 shadow-lg shadow-cyan-950/40'
                    : 'bg-cyan-50 border-cyan-400 shadow-sm'
                  : isDone
                  ? isDark
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-emerald-50/70 border-emerald-200'
                  : isDark
                  ? 'bg-slate-950/60 border-slate-800/80 opacity-65'
                  : 'bg-slate-50 border-slate-200/80 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isCurrent
                      ? isDark
                        ? 'text-cyan-400 animate-pulse'
                        : 'text-cyan-600 animate-pulse'
                      : isDone
                      ? isDark
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isCurrent
                      ? isDark
                        ? 'bg-cyan-400/15 text-cyan-300'
                        : 'bg-cyan-100 text-cyan-700'
                      : isDone
                      ? isDark
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-emerald-100 text-emerald-700'
                      : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCurrent ? t.active : isDone ? t.done : t.queued}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {stage.title}
              </p>
              <p
                className={`text-[11px] mt-1 line-clamp-2 leading-snug ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}