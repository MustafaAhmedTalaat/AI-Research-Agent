import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Download, FileDown, Clock, BookOpen } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function ReportViewerModal({
  report,
  onClose,
  onExportMarkdown,
  onExportPDF,
}) {
  const { t, isDark } = usePreferences();

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div
        className={`border rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b ${
            isDark
              ? 'border-slate-800 bg-slate-950/60'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="min-w-0">
            <div
              className={`flex flex-wrap items-center gap-2 text-xs mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <span>{report.createdAt}</span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isDark ? 'text-cyan-300' : 'text-cyan-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {report.sources_count ?? 0} {t.totalSources}
              </span>
              {report.processing_time && (
                <>
                  <span>•</span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      isDark ? 'text-emerald-300' : 'text-emerald-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {report.processing_time}s
                  </span>
                </>
              )}
            </div>
            <h3
              className={`text-lg sm:text-2xl font-extrabold break-words ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {report.topic}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
            <button
              type="button"
              onClick={() => onExportMarkdown(report)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-200/80 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t.markdown}</span>
            </button>
            <button
              type="button"
              onClick={() => onExportPDF(report)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.pdf}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300'
                  : 'bg-slate-200/70 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          dir={report.language === 'Arabic' ? 'rtl' : 'ltr'}
          className={`p-4 sm:p-6 md:p-8 overflow-y-auto prose max-w-none leading-relaxed ${
            isDark ? 'prose-invert text-slate-200' : 'text-slate-800'
          }`}
        >
          <ReactMarkdown>{report.report || ''}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}