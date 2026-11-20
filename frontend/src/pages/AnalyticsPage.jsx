import React from 'react';
import {
  FileText,
  Globe,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { usePreferences } from '../context/PreferencesContext';

const PIE_COLORS = ['#06b6d4', '#6366f1', '#10b981'];

export default function AnalyticsPage({ reports = [] }) {
  const { t, isDark, isArabic } = usePreferences();

  const totalReports = reports.length;
  const totalSources = reports.reduce(
    (acc, r) => acc + (Number(r.sources_count) || 0),
    0
  );

  const avgSources =
    totalReports > 0 ? (totalSources / totalReports).toFixed(1) : '0.0';

  const durations = reports
    .map((r) => Number(r.processing_time))
    .filter((n) => !Number.isNaN(n) && n > 0);

  const avgTime =
    durations.length > 0
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : '0.0';

  const groundedReports = reports.filter(
    (r) => (Number(r.sources_count) || 0) > 0
  ).length;
  const groundingRate =
    totalReports > 0 ? Math.round((groundedReports / totalReports) * 100) : 0;

  const recentChartData = [...reports]
    .slice(0, 7)
    .reverse()
    .map((r, idx) => ({
      name: (r.topic || `${idx + 1}`).slice(0, 14),
      fullTopic: r.topic || `${idx + 1}`,
      sources: Number(r.sources_count) || 0,
      seconds: Number(r.processing_time) || 0,
    }));

  const depthCounts = [
    {
      name: t.shallow,
      value: reports.filter((r) => (r.depth || 'medium') === 'shallow').length,
    },
    {
      name: t.medium,
      value: reports.filter((r) => (r.depth || 'medium') === 'medium').length,
    },
    {
      name: t.deep,
      value: reports.filter((r) => (r.depth || 'medium') === 'deep').length,
    },
  ];

  const hasDepthData = depthCounts.some((d) => d.value > 0);

  const panelClass = `border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg min-w-0 transition-colors ${
    isDark
      ? 'bg-slate-900/90 border-slate-800 shadow-black/30'
      : 'bg-white border-slate-200 shadow-slate-200/60'
  }`;

  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const axisStroke = isDark ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#cbd5e1',
    borderRadius: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '12px',
  };

  const depthBadgeText = (d) => {
    if (d === 'shallow') return t.shallow;
    if (d === 'deep') return t.deep;
    return t.medium;
  };

  const kpiCards = [
    {
      label: t.totalReports,
      value: totalReports,
      icon: FileText,
      iconWrap: isDark
        ? 'bg-cyan-500/10 border-cyan-400/25 text-cyan-400'
        : 'bg-cyan-50 border-cyan-200 text-cyan-700',
      valueColor: isDark ? 'text-white' : 'text-slate-900',
    },
    {
      label: t.totalSources,
      value: totalSources,
      icon: Globe,
      iconWrap: isDark
        ? 'bg-indigo-500/10 border-indigo-400/25 text-indigo-400'
        : 'bg-indigo-50 border-indigo-200 text-indigo-700',
      valueColor: isDark ? 'text-cyan-400' : 'text-cyan-600',
    },
    {
      label: t.avgTime,
      value: `${avgTime}s`,
      icon: Clock,
      iconWrap: isDark
        ? 'bg-emerald-500/10 border-emerald-400/25 text-emerald-400'
        : 'bg-emerald-50 border-emerald-200 text-emerald-700',
      valueColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
    },
    {
      label: isArabic ? 'متوسط المصادر / تقرير' : 'Avg. Sources / Report',
      value: avgSources,
      icon: Layers,
      iconWrap: isDark
        ? 'bg-sky-500/10 border-sky-400/25 text-sky-400'
        : 'bg-sky-50 border-sky-200 text-sky-700',
      valueColor: isDark ? 'text-indigo-300' : 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div
        className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/35 border-slate-800'
            : 'bg-gradient-to-br from-white via-slate-50 to-cyan-50/60 border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold mb-2 ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-400/25 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isArabic ? 'مؤشرات الأداء والبحث' : 'Telemetry & Research Metrics'}
            </span>
          </div>
          <h2
            className={`text-xl sm:text-3xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t.analyticsTitle}
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {t.analyticsSub}
          </p>
        </div>

        {/* Source Grounding Progress Card */}
        <div
          className={`border rounded-2xl p-4 w-full md:w-72 shrink-0 ${
            isDark
              ? 'bg-slate-950/75 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-semibold inline-flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {isArabic ? 'تغطية المصادر الحية' : 'Web-Grounded Rate'}
              </span>
            </span>
            <span className="font-black text-emerald-500">{groundingRate}%</span>
          </div>
          <div
            className={`w-full h-2 rounded-full overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${groundingRate}%` }}
            />
          </div>
          <p
            className={`text-[11px] mt-1.5 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            {isArabic
              ? `${groundedReports} من ${totalReports} تقارير مدعومة بمصادر ويب`
              : `${groundedReports} of ${totalReports} reports backed by web sources`}
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {kpiCards.map(({ label, value, icon: Icon, iconWrap, valueColor }) => (
          <div key={label} className={panelClass}>
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconWrap}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-3xl font-black mt-3 ${valueColor}`}>{value}</p>
          </div>
        ))}
      </div>

      {totalReports === 0 ? (
        <div className={`${panelClass} p-12 text-center`}>
          <p
            className={`text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {t.noChartData}
          </p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Bar Chart */}
            <div className={panelClass}>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3
                  className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.chartSourcesTitle}
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 font-semibold">
                  {isArabic ? 'مصادر' : 'Sources'}
                </span>
              </div>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" stroke={axisStroke} fontSize={11} />
                    <YAxis
                      stroke={axisStroke}
                      fontSize={11}
                      allowDecimals={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="sources"
                      fill="#06b6d4"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Area Chart */}
            <div className={panelClass}>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3
                  className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.chartDurationTitle}
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                  {isArabic ? 'ثانية' : 'Seconds'}
                </span>
              </div>
              <div className="h-56 sm:h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recentChartData}>
                    <defs>
                      <linearGradient
                        id="durationGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" stroke={axisStroke} fontSize={11} />
                    <YAxis stroke={axisStroke} fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="seconds"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#durationGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Depth Distribution Pie Chart */}
            {hasDepthData && (
              <div className={`${panelClass} lg:col-span-2`}>
                <h3
                  className={`text-sm font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.chartDepthTitle}
                </h3>
                <div className="h-60 sm:h-64 flex flex-col sm:flex-row items-center justify-around gap-6">
                  <div className="w-full sm:w-64 h-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={depthCounts}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={4}
                        >
                          {depthCounts.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {depthCounts.map((item, i) => {
                      const pct =
                        totalReports > 0
                          ? Math.round((item.value / totalReports) * 100)
                          : 0;
                      return (
                        <div
                          key={item.name}
                          className={`flex items-center gap-2.5 border px-4 py-2.5 rounded-xl ${
                            isDark
                              ? 'bg-slate-950/80 border-slate-800'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {item.value} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Runs Summary Table */}
          <div className={panelClass}>
            <h3
              className={`text-sm font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isArabic
                ? 'سجل أحدث عمليات البحث'
                : 'Recent Research Runs Breakdown'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark
                        ? 'border-slate-800 text-slate-400'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <th
                      className={`py-2.5 px-3 font-bold ${
                        isArabic ? 'text-right' : 'text-left'
                      }`}
                    >
                      {isArabic ? 'الموضوع' : 'Topic'}
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center">
                      {isArabic ? 'العمق' : 'Depth'}
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center">
                      {isArabic ? 'اللغة' : 'Language'}
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center">
                      {isArabic ? 'المصادر' : 'Sources'}
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center">
                      {isArabic ? 'المدة' : 'Duration'}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? 'divide-slate-800/70' : 'divide-slate-100'
                  }`}
                >
                  {reports.slice(0, 6).map((rep) => (
                    <tr
                      key={rep.id}
                      className={
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }
                    >
                      <td
                        className={`py-3 px-3 font-semibold max-w-[220px] truncate ${
                          isDark ? 'text-slate-100' : 'text-slate-800'
                        }`}
                      >
                        {rep.topic}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isDark
                              ? 'bg-indigo-500/15 text-indigo-300'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {depthBadgeText(rep.depth)}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-3 text-center text-xs ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {rep.language || 'English'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-cyan-500">
                        {rep.sources_count ?? 0}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-xs text-emerald-500">
                        {rep.processing_time ? `${rep.processing_time}s` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}