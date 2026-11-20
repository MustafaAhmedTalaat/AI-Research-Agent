import React, { useState } from 'react';
import {
  Home,
  Compass,
  FolderKanban,
  LineChart,
  Code2,
  Sparkles,
  Sun,
  Moon,
  Languages,
  PanelTopClose,
  PanelTopOpen,
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function Navbar({ activeTab, setActiveTab, savedCount }) {
  const { t, isDark, toggleTheme, toggleLang, isArabic } = usePreferences();
  const [isOpen, setIsOpen] = useState(true);

  const tabs = [
    { id: 'home', label: t.navHome, icon: Home, badge: null },
    { id: 'research', label: t.navResearch, icon: Compass, badge: null },
    { id: 'history', label: t.navArchive, icon: FolderKanban, badge: savedCount },
    { id: 'analytics', label: t.navAnalytics, icon: LineChart, badge: null },
    { id: 'developer', label: t.navDeveloper, icon: Code2, badge: null },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
  };

  return (
    <header className="sticky top-2 sm:top-4 z-30 mb-6 sm:mb-10">
      <nav
        className={`backdrop-blur-xl border px-3.5 py-3 sm:px-6 sm:py-3.5 rounded-2xl shadow-xl transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800/90 shadow-black/40'
            : 'bg-white/90 border-slate-200/90 shadow-slate-200/70'
        }`}
      >
        {/* Top Row: Brand + Toggle Collapse Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSelectTab('home')}
            className={`flex items-center gap-2.5 sm:gap-3 group cursor-pointer min-w-0 ${
              isArabic ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`p-2 sm:p-2.5 rounded-xl border transition shrink-0 ${
                isDark
                  ? 'bg-cyan-500/10 border-cyan-400/25 group-hover:border-cyan-400/50'
                  : 'bg-cyan-50 border-cyan-200 group-hover:border-cyan-400'
              }`}
            >
              <Sparkles
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}
              />
            </div>
            <div className="min-w-0">
              <span
                className={`font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r bg-clip-text text-transparent block leading-tight truncate ${
                  isDark
                    ? 'from-cyan-300 via-sky-400 to-indigo-400'
                    : 'from-cyan-700 via-sky-600 to-indigo-600'
                }`}
              >
                {t.brandTitle}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-medium block truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {t.brandSubtitle}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              isDark
                ? 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-cyan-300'
                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-cyan-700'
            }`}
            title={
              isOpen
                ? isArabic
                  ? 'إغلاق شريط التنقل'
                  : 'Collapse Navbar'
                : isArabic
                ? 'فتح شريط التنقل'
                : 'Expand Navbar'
            }
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <>
                <PanelTopClose className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isArabic ? 'إغلاق' : 'Close'}
                </span>
              </>
            ) : (
              <>
                <PanelTopOpen className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isArabic ? 'فتح القائمة' : 'Open Menu'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Body: Pages + Language & Theme Controls */}
        {isOpen && (
          <div
            className={`mt-3 pt-3 border-t flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200/80'
            }`}
          >
            <div
              className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800/80'
                  : 'bg-slate-100/90 border-slate-200/80'
              }`}
            >
              {tabs.map(({ id, label, icon: Icon, badge }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectTab(id)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                      active
                        ? isDark
                          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/30 shadow-sm'
                          : 'bg-white text-cyan-700 border border-cyan-200 shadow-sm'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                        active
                          ? isDark
                            ? 'text-cyan-400'
                            : 'text-cyan-600'
                          : isDark
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                    {typeof badge === 'number' && (
                      <span
                        className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          active
                            ? isDark
                              ? 'bg-cyan-400/20 text-cyan-300'
                              : 'bg-cyan-100 text-cyan-700'
                            : isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleLang}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
                }`}
                title="Switch Language"
              >
                <Languages className="w-4 h-4 text-cyan-500" />
                <span>{isArabic ? 'EN' : 'العربية'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                  isDark
                    ? 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-indigo-600'
                }`}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}