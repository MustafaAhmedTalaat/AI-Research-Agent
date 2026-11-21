import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Download,
  FileDown,
  Maximize2,
  BookmarkX,
  Clock,
  Layers,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function HistoryPage({
  reports,
  searchQuery,
  setSearchQuery,
  onDeleteReport,
  onExportMarkdown,
  onExportPDF,
  onOpenReport,
}) {
  const { t, isDark, isArabic } = usePreferences();
  const [depthFilter, setDepthFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');

  const filtered = reports.filter((rep) => {
    const q = searchQuery.toLowerCase();
    const matchesText =
      (rep.topic || '').toLowerCase().includes(q) ||
      (rep.report || '').toLowerCase().includes(q);
    const matchesDepth = depthFilter === 'all' || rep.depth === depthFilter;
    const matchesLang =
      langFilter === 'all' || (rep.language || 'English') === langFilter;
    return matchesText && matchesDepth && matchesLang;
  });

  const depthLabel = (d) => {
    if (d === 'shallow') return t.shallow;
    if (d === 'deep') return t.deep;
    return t.medium;
  };

  const controlClass = `border rounded-xl text-xs sm:text-sm focus:outline-none transition ${
    isDark
      ? 'bg-slate-950 border-slate-800 focus:border-cyan-400/60 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 focus:border-cyan-600 text-slate-900 placeholder-slate-400'
  }`;

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border p-4 sm:p-5 rounded-2xl transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="min-w-0">
          <h2
            className={`text-lg sm:text-xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.archiveTitle}
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {t.archiveSub}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                isArabic ? 'right-3.5' : 'left-3.5'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full sm:w-56 py-2 ${
                isArabic ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
              } ${controlClass}`}
            />
          </div>

          <select
            value={depthFilter}
            onChange={(e) => setDepthFilter(e.target.value)}
            className={`px-3 py-2 font-semibold cursor-pointer ${controlClass}`}
          >
            <option value="all">{t.allDepths}</option>
            <option value="shallow">{t.shallow}</option>
            <option value="medium">{t.medium}</option>
            <option value="deep">{t.deep}</option>
          </select>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className={`px-3 py-2 font-semibold cursor-pointer ${controlClass}`}
          >
            <option value="all">{t.allLangs}</option>
            <option value="English">English</option>
            <option value="Arabic">العربية</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`border rounded-3xl p-10 sm:p-14 text-center ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <BookmarkX
            className={`w-12 h-12 mx-auto mb-3 ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`}
          />
          <h3
            className={`text-base font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            {t.noReports}
          </h3>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            {t.noReportsHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filtered.map((rep) => (
            <div
              key={rep.id}
              className={`border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-lg transition min-w-0 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div className="space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border font-medium ${
                      isDark
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                    }`}
                  >
                    {rep.createdAt || '-'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border font-semibold ${
                      isDark
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {depthLabel(rep.depth)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium ${
                      isDark
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rep.language || 'English'}
                  </span>
                </div>

                <h3
                  className={`text-base sm:text-lg font-bold leading-snug break-words ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {rep.topic}
                </h3>

                <p
                  className={`text-xs line-clamp-3 leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {(rep.report || '').replace(/[#*_`>-]/g, '')}
                </p>
              </div>

              <div
                className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}
              >
                <div
                  className={`flex items-center gap-3 text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <Layers className="w-3.5 h-3.5" />
                    {rep.sources_count ?? 0}
                  </span>
                  {rep.processing_time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {rep.processing_time}s
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenReport(rep)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                      isDark
                        ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300'
                        : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.readBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onExportMarkdown(rep)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={t.markdown}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onExportPDF(rep)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-indigo-700'
                    }`}
                    title={t.pdf}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteReport(rep.id)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300'
                        : 'bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700'
                    }`}
                    title={t.deleteBtn}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}