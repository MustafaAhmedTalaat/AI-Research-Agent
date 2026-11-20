import React, { createContext, useContext, useEffect, useState } from 'react';

const PreferencesContext = createContext();

const DICT = {
  en: {
    brandTitle: 'Research Intelligence Hub',
    brandSubtitle: 'Multi-Agent Synthesis & Analytics',
    navHome: 'Home',
    navResearch: 'Research',
    navArchive: 'Archive',
    navAnalytics: 'Analytics',
    navDeveloper: 'Developer',
    heroBadge: 'LangGraph Multi-Agent Research System',
    heroTitlePrefix: 'Deep Research, Automated by',
    heroTitleHighlight: 'Coordinated AI Agents',
    heroDesc:
      'Enter a research topic, choose your depth and language, and let specialized agents gather web sources, extract insights, and generate clean Markdown or PDF reports.',
    launchStudio: 'Launch Research Studio',
    viewArchive: 'View Archive',
    developerBtn: 'Developer',
    pipelineLabel: 'Execution Pipeline:',
    stepPlanner: '01. Planner',
    stepSearcher: '02. Searcher',
    stepReader: '03. Reader',
    stepAnalyst: '04. Analyst',
    stepWriter: '05. Writer',
    cap1Title: 'Autonomous Planning',
    cap1Desc: 'Breaks any topic into focused research questions and targeted search queries.',
    cap2Title: 'Live Web Grounding',
    cap2Desc: 'Searches the web, extracts page content, and handles transient network errors gracefully.',
    cap3Title: 'Resilient LLM Routing',
    cap3Desc: 'Prioritizes free cloud models on OpenRouter with automatic retries and fallback support.',
    cap4Title: 'Structured Export & Archive',
    cap4Desc: 'Save reports locally, filter by depth or language, visualize metrics, and export MD or PDF.',
    quickStarters: 'Quick starters:',
    researchHeadingPrefix: 'Turn Any Topic Into a',
    researchHeadingHighlight: 'Structured Report',
    researchSub:
      'Configure research depth and output language while specialized agents plan queries, gather live web sources, extract insights, and write your report.',
    topicLabel: 'Research Topic',
    topicPlaceholder: 'e.g., Event-Driven Microservices Architecture',
    focusLabel: 'Focus Areas & Constraints (Optional)',
    focusPlaceholder: 'Highlight reliability patterns, idempotency, dead-letter queues, or trade-offs...',
    depthLabel: 'Analysis Depth',
    depthShallow: 'Shallow — Fast Executive Brief',
    depthMedium: 'Medium — Balanced Technical Overview',
    depthDeep: 'Deep — Comprehensive Investigation',
    reportLangLabel: 'Report Language',
    generateBtn: 'Generate Research Report',
    generatingBtn: 'Orchestrating Multi-Agent Research...',
    reportReady: 'Report Ready',
    completedIn: 'Completed in',
    sourcesAnalyzed: 'web sources analyzed',
    copyMd: 'Copy MD',
    copied: 'Copied',
    markdown: 'Markdown',
    pdf: 'PDF',
    subQuestions: 'Research Sub-Questions',
    refSources: 'Referenced Web Sources',
    finalReport: 'Final Research Report',
    livePipeline: 'Live Multi-Agent Pipeline',
    stage: 'Stage',
    active: 'Active',
    done: 'Done',
    queued: 'Queued',
    archiveTitle: 'Saved Research Archive',
    archiveSub: 'Search, filter, preview in full screen, or export saved reports.',
    searchPlaceholder: 'Search topics or content...',
    allDepths: 'All Depths',
    shallow: 'Shallow',
    medium: 'Medium',
    deep: 'Deep',
    allLangs: 'All Languages',
    noReports: 'No matching reports found',
    noReportsHint: 'Adjust your search or filters, or create a new report in Research Studio.',
    readBtn: 'Read',
    deleteBtn: 'Delete Report',
    analyticsTitle: 'Analytics & Performance',
    analyticsSub: 'Visual breakdown of source coverage, execution time, and research depth.',
    totalReports: 'Total Reports',
    totalSources: 'Sources Analyzed',
    avgTime: 'Avg. Execution Time',
    noChartData: 'Run a few research topics first to populate interactive charts.',
    chartSourcesTitle: 'Web Sources per Recent Report',
    chartDurationTitle: 'Processing Duration Trend (Seconds)',
    chartDepthTitle: 'Research Depth Distribution',
    devBadge: 'Developer & System Architecture',
    devName: 'Mustafa Ahmed Talaat',
    devBio:
      'Full-stack & AI application developer building cloud-powered research workflows, modular React interfaces, and fault-tolerant FastAPI + LangGraph backends.',
    testPipeline: 'Test Research Pipeline',
    swaggerDocs: 'FastAPI Swagger Docs',
    devImageHint: 'Place your photo at public/images/developer-avatar.png',
    footerText: 'Research Intelligence Hub • Built by Mustafa Ahmed Talaat',
  },
  ar: {
    brandTitle: 'مركز الذكاء البحثي',
    brandSubtitle: 'تنسيق الوكلاء المتعدد والتحليلات',
    navHome: 'الرئيسية',
    navResearch: 'البحث',
    navArchive: 'الأرشيف',
    navAnalytics: 'التحليلات',
    navDeveloper: 'المطور',
    heroBadge: 'منظومة بحث متعددة الوكلاء عبر LangGraph',
    heroTitlePrefix: 'أبحاث معمّقة ومؤتمتة عبر',
    heroTitleHighlight: 'وكلاء ذكاء اصطناعي متكاملين',
    heroDesc:
      'اكتب موضوع البحث واختر مستوى العمق واللغة، لتقوم الوكلاء بجمع المصادر من الويب واستخلاص الأفكار وصياغة تقرير منظم قابل للتصدير بصيغة Markdown أو PDF.',
    launchStudio: 'ابدأ استوديو البحث',
    viewArchive: 'عرض الأرشيف',
    developerBtn: 'صفحة المطور',
    pipelineLabel: 'مسار التنفيذ:',
    stepPlanner: '01. المخطط',
    stepSearcher: '02. الباحث',
    stepReader: '03. القارئ',
    stepAnalyst: '04. المحلل',
    stepWriter: '05. الكاتب',
    cap1Title: 'تخطيط ذاتي منظم',
    cap1Desc: 'يقسّم الموضوع إلى أسئلة بحثية مركزة واستعلامات بحث دقيقة.',
    cap2Title: 'ربط مباشر بمصادر الويب',
    cap2Desc: 'يبحث في الويب ويستخرج محتوى الصفحات ويتجاوز أعطال الشبكة المؤقتة بسلاسة.',
    cap3Title: 'توجيه مرن للنماذج السحابية',
    cap3Desc: 'يعتمد على النماذج المجانية عبر OpenRouter مع إعادة المحاولة والتبديل الاحتياطي دون إجهاد الجهاز.',
    cap4Title: 'أرشيف وتصدير متكامل',
    cap4Desc: 'احفظ التقارير محلياً، وصفّها حسب العمق أو اللغة، وتابع الرسوم البيانية، وصدّرها MD أو PDF.',
    quickStarters: 'مواضيع جاهزة:',
    researchHeadingPrefix: 'حوّل أي موضوع إلى',
    researchHeadingHighlight: 'تقرير بحثي متكامل',
    researchSub:
      'حدد عمق التحليل ولغة التقرير بينما تعمل الوكلاء على تخطيط البحث وجمع المصادر واستخلاص النتائج وكتابة التقرير النهائي.',
    topicLabel: 'موضوع البحث',
    topicPlaceholder: 'مثال: معمارية الخدمات المصغرة المعتمدة على الأحداث',
    focusLabel: 'نقاط تركيز إضافية (اختياري)',
    focusPlaceholder: 'ركّز على أنماط الاعتمادية، عدم التكرار، طوابير الفشل، أو المفاضلات العملية...',
    depthLabel: 'عمق التحليل',
    depthShallow: 'سريع — ملخص تنفيذي مركّز',
    depthMedium: 'متوسط — عرض تقني متوازن',
    depthDeep: 'معمّق — دراسة شاملة وتفصيلية',
    reportLangLabel: 'لغة التقرير',
    generateBtn: 'إنشاء التقرير البحثي',
    generatingBtn: 'جاري تشغيل الوكلاء وتنفيذ البحث...',
    reportReady: 'التقرير جاهز',
    completedIn: 'اكتمل خلال',
    sourcesAnalyzed: 'مصدر ويب تم تحليله',
    copyMd: 'نسخ MD',
    copied: 'تم النسخ',
    markdown: 'Markdown',
    pdf: 'PDF',
    subQuestions: 'الأسئلة البحثية الفرعية',
    refSources: 'المصادر المرجعية من الويب',
    finalReport: 'التقرير البحثي النهائي',
    livePipeline: 'مسار الوكلاء المباشر',
    stage: 'المرحلة',
    active: 'جاري العمل',
    done: 'مكتمل',
    queued: 'في الانتظار',
    archiveTitle: 'أرشيف التقارير المحفوظة',
    archiveSub: 'ابحث وصفّ التقارير المحفوظة وافتحها بملء الشاشة أو صدّرها.',
    searchPlaceholder: 'ابحث في العناوين أو المحتوى...',
    allDepths: 'كل المستويات',
    shallow: 'سريع',
    medium: 'متوسط',
    deep: 'معمّق',
    allLangs: 'كل اللغات',
    noReports: 'لا توجد تقارير مطابقة للبحث',
    noReportsHint: 'غيّر كلمة البحث أو الفلاتر، أو أنشئ تقريراً جديداً من صفحة البحث.',
    readBtn: 'قراءة',
    deleteBtn: 'حذف التقرير',
    analyticsTitle: 'التحليلات والأداء',
    analyticsSub: 'عرض مرئي لتغطية المصادر وزمن التنفيذ وتوزيع مستويات العمق.',
    totalReports: 'إجمالي التقارير',
    totalSources: 'المصادر المحللة',
    avgTime: 'متوسط زمن التنفيذ',
    noChartData: 'نفّذ بعض الأبحاث أولاً لعرض الرسوم البيانية التفاعلية.',
    chartSourcesTitle: 'عدد المصادر لكل تقرير حديث',
    chartDurationTitle: 'منحنى زمن التنفيذ (بالثواني)',
    chartDepthTitle: 'توزيع مستويات عمق البحث',
    devBadge: 'المطور ومعمارية النظام',
    devName: 'مصطفى أحمد طلعت',
    devBio:
      'مطور تطبيقات ويب وذكاء اصطناعي يعمل على بناء مسارات بحث سحابية وواجهات React معيارية وخوادم FastAPI + LangGraph عالية الاعتمادية.',
    testPipeline: 'اختبار مسار البحث',
    swaggerDocs: 'وثائق FastAPI التفاعلية',
    devImageHint: 'ضع صورتك في المسار public/images/developer-avatar.png',
    footerText: 'مركز الذكاء البحثي • تطوير مصطفى أحمد طلعت',
  },
};

export function PreferencesProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ui_lang') || 'ar');
  const [theme, setTheme] = useState(() => localStorage.getItem('ui_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('ui_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ui_theme', theme);
  }, [theme]);

  const isArabic = lang === 'ar';
  const isDark = theme === 'dark';
  const t = DICT[lang] || DICT.en;

  const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <PreferencesContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isArabic,
        theme,
        setTheme,
        toggleTheme,
        isDark,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}