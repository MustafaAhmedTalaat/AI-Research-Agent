import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cleanReportText } from '../utils/reportCleaner';
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Download,
  FileDown,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import AgentPipelineStepper from '../components/AgentPipelineStepper';
import { usePreferences } from '../context/PreferencesContext';

const QUICK_PROMPTS = [
  {
    topic: 'Retrieval-Augmented Generation vs Fine-Tuning',
    description: 'Compare latency, cost, hallucination reduction, and enterprise maintenance.',
    depth: 'medium',
  },
  {
    topic: 'Distributed Consensus Algorithms in Cloud Systems',
    description: 'Focus on Raft vs Paxos trade-offs and fault tolerance.',
    depth: 'deep',
  },
  {
    topic: 'WebAssembly at the Edge',
    description: 'Cold starts, sandboxing security, and serverless use cases.',
    depth: 'shallow',
  },
];

export default function ResearchPage({
  onReportSaved,
  onExportMarkdown,
  onExportPDF,
}) {
  const { t, isDark } = usePreferences();

  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [depth, setDepth] = useState('medium');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset) => {
    setTopic(preset.topic);
    setDescription(preset.description);
    setDepth(preset.depth);
    setError('');
  };

  const handleRunResearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, description, depth, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate research report');
      }

      const enriched = {
        ...data,
        topic: data.topic || topic,
        depth,
        language,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
      };

      setResult(enriched);
      onReportSaved(enriched);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    };

    const cleanedReport = cleanReportText(data.report || '');

const enriched = {
  ...data,
  report: cleanedReport,
  topic: data.topic || topic,
  depth,
  language,
  id: Date.now(),
  createdAt: new Date().toLocaleString(),
};
  };

  const handleCopy = async () => {
    if (!result?.report) return;
    await navigator.clipboard.writeText(`# ${result.topic}\n\n${result.report}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = `w-full border rounded-2xl px-4 py-3.5 text-sm focus:outline-none transition ${
    isDark
      ? 'bg-slate-950/90 border-slate-800 focus:border-cyan-400/60 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 focus:border-cyan-600 text-slate-900 placeholder-slate-400'
  }`;

  const cardClass = `border rounded-2xl sm:rounded-3xl transition-colors ${
    isDark
      ? 'bg-slate-900 border-slate-800 shadow-xl'
      : 'bg-white border-slate-200 shadow-lg shadow-slate-200/60'
  }`;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="text-center max-w-2xl mx-auto px-1">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3 sm:mb-4 ${
            isDark
              ? 'bg-cyan-500/10 border-cyan-400/25 text-cyan-300'
              : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{t.heroBadge}</span>
        </div>

        <h1
          className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {t.researchHeadingPrefix}{' '}
          <span
            className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isDark
                ? 'from-cyan-300 via-sky-400 to-indigo-400'
                : 'from-cyan-700 via-sky-600 to-indigo-600'
            }`}
          >
            {t.researchHeadingHighlight}
          </span>
        </h1>

        <p
          className={`mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {t.researchSub}
        </p>
      </section>

      {/* Quick Starters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className={`text-xs font-semibold ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          {t.quickStarters}
        </span>
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.topic}
            type="button"
            onClick={() => applyPreset(item)}
            className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer max-w-full truncate ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/30'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-cyan-700 border-slate-200 hover:border-cyan-300'
            }`}
          >
            {item.topic}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleRunResearch}
        className={`${cardClass} p-5 sm:p-8 space-y-5 sm:space-y-6`}
      >
        <div>
          <label
            className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {t.topicLabel}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.topicPlaceholder}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {t.focusLabel}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.focusPlaceholder}
            rows="2"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {t.depthLabel}
            </label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="shallow">{t.depthShallow}</option>
              <option value="medium">{t.depthMedium}</option>
              <option value="deep">{t.depthDeep}</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {t.reportLangLabel}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="English">English</option>
              <option value="Arabic">العربية</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              <span>{t.generatingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>
      </form>

      <AgentPipelineStepper isRunning={loading} />

      {error && (
        <div
          className={`border p-4 sm:p-5 rounded-2xl flex items-center gap-3 ${
            isDark
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div
            className={`${cardClass} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  isDark
                    ? 'bg-emerald-500/15 border-emerald-400/30'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-bold text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.reportReady}
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {t.completedIn}{' '}
                  <span className="font-semibold text-emerald-500">
                    {result.processing_time ?? '-'}s
                  </span>{' '}
                  •{' '}
                  <span className="font-semibold text-cyan-500">
                    {result.sources_count ?? 0}
                  </span>{' '}
                  {t.sourcesAnalyzed}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-500" />
                    <span>{t.copyMd}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onExportMarkdown(result)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <Download className="w-4 h-4 text-sky-500" />
                <span>{t.markdown}</span>
              </button>

              <button
                type="button"
                onClick={() => onExportPDF(result)}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{t.pdf}</span>
              </button>
            </div>
          </div>

          {result.plan?.sub_questions?.length > 0 && (
            <div className={`${cardClass} p-5 sm:p-6`}>
              <h3
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  isDark ? 'text-indigo-300' : 'text-indigo-700'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>{t.subQuestions}</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                {result.plan.sub_questions.map((q, idx) => (
                  <li
                    key={idx}
                    className={`border rounded-xl px-4 py-2.5 ${
                      isDark
                        ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(result.sources) && result.sources.length > 0 && (
            <div className={`${cardClass} p-5 sm:p-6`}>
              <h3
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 ${
                  isDark ? 'text-cyan-300' : 'text-cyan-700'
                }`}
              >
                {t.refSources} ({result.sources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 text-xs transition min-w-0 ${
                      isDark
                        ? 'bg-slate-950/70 hover:bg-slate-950 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-cyan-400 text-slate-700'
                    }`}
                  >
                    <span className="truncate font-medium">
                      {src.title || src.url}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <article
            dir={result.language === 'Arabic' ? 'rtl' : 'ltr'}
            className={`${cardClass} p-5 sm:p-8 md:p-10`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <h2
                className={`text-lg sm:text-2xl font-black flex items-center gap-2.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 shrink-0" />
                <span>{t.finalReport}</span>
              </h2>
              <span
                className={`text-xs px-3 py-1 rounded-full font-mono ${
                  isDark
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {result.topic}
              </span>
            </div>

            <div
              className={`prose max-w-none leading-relaxed ${
                isDark ? 'prose-invert text-slate-200' : 'text-slate-800'
              }`}
            >
              <ReactMarkdown>{result.report || ''}</ReactMarkdown>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}