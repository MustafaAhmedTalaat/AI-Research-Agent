import React, { useState } from 'react';
import {
  Code2,
  Server,
  Sparkles,
  Workflow,
  Cpu,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { API_BASE_URL } from '../api';

const DEV_IMAGE_SRC = '/images/developer-avatar.png';

export default function DeveloperPage({ onNavigate }) {
  const { t, isDark, isArabic } = usePreferences();
  const [imgError, setImgError] = useState(false);

  const stackItems = [
    {
      category: isArabic ? 'هوية المنصة' : 'Platform Identity',
      title: t.brandTitle,
      desc: isArabic
        ? 'منصة بحث ذكية متعددة الوكلاء تدعم اللغة العربية والإنجليزية والوضع الليلي والنهاري مع أرشيف وتحليلات وتصدير MD و PDF.'
        : 'Multi-agent research platform with bilingual Arabic/English support, dark/light themes, archive filtering, analytics, and MD/PDF export.',
      icon: Sparkles,
      badge: isArabic ? 'المنصة' : 'Platform',
    },
    {
      category: isArabic ? 'تنسيق الوكلاء' : 'Agent Orchestration',
      title: 'FastAPI + LangGraph',
      desc: isArabic
        ? 'مسار عمل متعدد المراحل يربط وكلاء التخطيط والبحث والقراءة والتحليل والكتابة عبر HTTP.'
        : 'Stateful multi-agent pipeline coordinating Planner, Searcher, Reader, Analyst, and Writer nodes over HTTP.',
      icon: Workflow,
      badge: isArabic ? 'الخادم' : 'Backend Core',
    },
    {
      category: isArabic ? 'توجيه النماذج السحابية' : 'Cloud LLM Routing',
      title: 'OpenRouter Free Models + Gemini Fallback',
      desc: isArabic
        ? 'تشغيل سحابي يعتمد أولاً على الموديلات المجانية في OpenRouter مع إعادة المحاولة والرجوع التلقائي عند الحاجة.'
        : 'Cloud-first inference prioritizing free OpenRouter models with retry/backoff and fallback resilience without local heavy compute.',
      icon: Cpu,
      badge: isArabic ? 'الاستدلال' : 'Inference',
    },
    {
      category: isArabic ? 'جلب واستخراج المصادر' : 'Web Retrieval & Extraction',
      title: 'DDGS + Content Reader',
      desc: isArabic
        ? 'بحث متعدد المصادر واستخراج المحتوى مع عزل أخطاء الاتصال لكل استعلام لضمان عدم توقف المسار.'
        : 'Multi-engine web query execution and article extraction with per-query fault tolerance.',
      icon: Server,
      badge: isArabic ? 'البحث' : 'Retrieval',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section
        className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border-slate-800 shadow-black/40'
            : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 border-slate-200 shadow-slate-200/70'
        }`}
      >
        <div
          className={`flex flex-col lg:flex-row items-center gap-5 sm:gap-6 min-w-0 flex-1 w-full text-center ${
            isArabic ? 'lg:text-right' : 'lg:text-left'
          }`}
        >
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl sm:rounded-3xl overflow-hidden border mx-auto lg:mx-0 shrink-0 flex items-center justify-center shadow-lg ${
              isDark
                ? 'border-cyan-400/35 bg-slate-950'
                : 'border-cyan-300 bg-slate-100'
            }`}
          >
            {!imgError ? (
              <img
                src={DEV_IMAGE_SRC}
                alt={t.devName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Code2
                  className={`w-9 h-9 mb-1 ${
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  }`}
                />
                <span className="text-[10px] text-slate-400 leading-tight">
                  {t.devImageHint}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5 sm:space-y-3 min-w-0 flex-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-semibold ${
                isDark
                  ? 'bg-indigo-500/15 border-indigo-400/30 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t.devBadge}</span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-black break-words ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.devName}
            </h1>

            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {t.devBio}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1">
              {[
                'Python',
                'FastAPI',
                'LangGraph',
                'React',
                'Vite',
                'OpenRouter API',
                'Gemini API',
              ].map((skill) => (
                <span
                  key={skill}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs font-semibold ${
                    isDark
                      ? 'bg-slate-950/90 border-slate-800 text-cyan-300'
                      : 'bg-white border-slate-200 text-cyan-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('research')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>{t.testPipeline}</span>
          </button>

          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <span>{t.swaggerDocs}</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {stackItems.map(({ category, title, desc, icon: Icon, badge }) => (
          <div
            key={title}
            className={`border rounded-2xl p-5 sm:p-6 shadow-lg space-y-2.5 sm:space-y-3 min-w-0 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-xl border shrink-0 ${
                    isDark
                      ? 'bg-cyan-500/10 border-cyan-500/20'
                      : 'bg-cyan-50 border-cyan-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isDark ? 'text-cyan-400' : 'text-cyan-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold truncate ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {category}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                  isDark
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {badge}
              </span>
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