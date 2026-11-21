import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, FileDown } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { cleanReportText } from '../utils/reportCleaner';

export default function ReportViewerModal({
  report,
  onClose,
  onExportMarkdown,
  onExportPDF,
}) {
  const { t, isDark } = usePreferences();

  if (!report) return null;

  const cleanedContent = cleanReportText(report.report || '');
  const isRtl =
    report.language === 'Arabic' ||
    /[\u0600-\u06FF]/.test(cleanedContent.slice(0, 200));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className={`border rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div
          className={`px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark
              ? 'border-slate-800 bg-slate-950/70'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-lg truncate">
              {report.topic}
            </h3>
            <p
              className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {report.createdAt} • {report.language} • {report.depth}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onExportMarkdown({ ...report, report: cleanedContent })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.markdown}</span>
            </button>

            <button
              type="button"
              onClick={() => onExportPDF({ ...report, report: cleanedContent })}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.pdf}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`p-2 rounded-xl cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-3 leading-relaxed"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanedContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
