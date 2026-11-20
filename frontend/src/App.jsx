import React, { useEffect, useState } from 'react';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import Navbar from './components/Navbar';
import ReportViewerModal from './components/ReportViewerModal';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DeveloperPage from './pages/DeveloperPage';
import { exportReportMarkdown, exportReportPDF } from './utils/reportExporter';

const STORAGE_KEY = 'ai_research_history';

function AppShell() {
  const { t, isDark, setActiveTab: _ignore } = usePreferences();
  const [activeTab, setActiveTab] = useState('home');
  const [savedReports, setSavedReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(raw)) {
        setSavedReports(raw);
      }
    } catch {
      setSavedReports([]);
    }
  }, []);

  const updateStorage = (next) => {
    setSavedReports(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleReportSaved = (newItem) => {
    updateStorage([newItem, ...savedReports]);
  };

  const handleDeleteReport = (id) => {
    updateStorage(savedReports.filter((r) => r.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 md:px-10 md:py-10 flex flex-col transition-colors ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-cyan-400/25 selection:text-cyan-200'
          : 'bg-slate-100 text-slate-900 selection:bg-cyan-600/15 selection:text-cyan-900'
      }`}
    >
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedReports.length}
        />

        <main className="flex-1 min-w-0">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={setActiveTab}
              savedCount={savedReports.length}
            />
          )}

          {activeTab === 'research' && (
            <ResearchPage
              onReportSaved={handleReportSaved}
              onExportMarkdown={exportReportMarkdown}
              onExportPDF={exportReportPDF}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              reports={savedReports}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onDeleteReport={handleDeleteReport}
              onExportMarkdown={exportReportMarkdown}
              onExportPDF={exportReportPDF}
              onOpenReport={setSelectedReport}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsPage reports={savedReports} />}

          {activeTab === 'developer' && (
            <DeveloperPage onNavigate={setActiveTab} />
          )}
        </main>

        <footer
          className={`mt-12 sm:mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDark
              ? 'border-slate-900 text-slate-500'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          <span>{t.footerText}</span>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="hover:text-cyan-500 transition cursor-pointer"
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('research')}
              className="hover:text-cyan-500 transition cursor-pointer"
            >
              {t.navResearch}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('developer')}
              className="hover:text-cyan-500 transition cursor-pointer"
            >
              {t.navDeveloper}
            </button>
          </div>
        </footer>
      </div>

      <ReportViewerModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onExportMarkdown={exportReportMarkdown}
        onExportPDF={exportReportPDF}
      />
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <AppShell />
    </PreferencesProvider>
  );
}