const FILLER_PREFIX_PATTERNS = [
  /^(sure[,!.]?|certainly[,!.]?|of course[,!.]?|here is|here's)\s+.*?(report|analysis|overview|summary|response|guide).*?[:.\n]+/i,
  /^(بالتأكيد|حسناً|إليك|فيما يلي|هذا هو)\s+.*?(التقرير|البحث|الملخص|التحليل|العرض).*?[:.\n]+/i,
  /^(based on the (provided |search )?sources[,:]?|according to the retrieved (information|sources)[,:]?)\s*/i,
  /^(بناءً على المصادر (المقدمة|المتاحة|المستخرجة)[،:]*|وفقاً للمعلومات المستخرجة[،:]*)\s*/i,
  /<think>[\s\S]*?<\/think>/gi,
];

const FILLER_SUFFIX_PATTERNS = [
  /\n{1,3}(please let me know if you (need|would like|want) (more|any|further)[\s\S]*$)/i,
  /\n{1,3}(feel free to ask if you have any (questions|follow-ups)[\s\S]*$)/i,
  /\n{1,3}(إذا كنت بحاجة إلى (أي استفسارات|المزيد من التفاصيل|تعديلات إضافية)[\s\S]*$)/i,
  /\n{1,3}(لا تتردد في طرح أي أسئلة إضافية[\s\S]*$)/i,
  /\n{1,3}(نهاية التقرير|انتهى التقرير|end of report)\s*$/i,
];

function deduplicateLines(text) {
  const lines = text.split('\n');
  const seenNonEmpty = new Set();
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // احتفظ بالأسطر الفارغة وفواصل الجداول والعناوين والروابط
    if (!trimmed) {
      result.push('');
      continue;
    }

    const isStructural =
      /^#{1,6}\s/.test(trimmed) ||
      /^\|.*\|$/.test(trimmed) ||
      /^[-:| ]{3,}$/.test(trimmed) ||
      /^\$\$[\s\S]*\$\$$/.test(trimmed);

    if (isStructural) {
      result.push(line);
      continue;
    }

    const normalizedKey = trimmed
      .replace(/^[-*+•]\s+/, '')
      .replace(/^\d+[.)]\s+/, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    // احذف التكرار المباشر أو المتكرر لنفس الجملة/النقطة الطويلة
    if (normalizedKey.length > 25 && seenNonEmpty.has(normalizedKey)) {
      continue;
    }

    seenNonEmpty.add(normalizedKey);
    result.push(line);
  }

  return result.join('\n');
}

function normalizeTablesAndMath(text) {
  let output = text;

  // ضمان وجود سطر فارغ قبل وبعد الجداول لكي يعرضها Markdown بشكل صحيح
  output = output.replace(/([^\n])\n(\|[^\n]+\|)/g, '$1\n\n$2');
  output = output.replace(/(\|[^\n]+\|)\n(?!\|)/g, '$1\n\n');

  // ضبط كتل المعادلات $$ ... $$ لتكون في أسطر مستقلة نظيفة
  output = output.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, eq) => `\n$$\n${eq.trim()}\n$$\n`);

  // توحيد المسافات الرأسية الزائدة
  output = output.replace(/\n{3,}/g, '\n\n');

  return output.trim();
}

export function cleanReportText(rawText = '') {
  if (typeof rawText !== 'string') return '';

  const original = rawText.trim();
  if (!original) return '';

  let cleaned = original;

  for (const pattern of FILLER_PREFIX_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  for (const pattern of FILLER_SUFFIX_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  cleaned = deduplicateLines(cleaned);
  cleaned = normalizeTablesAndMath(cleaned);

  // ضمان عدم فقدان التقرير بالكامل إذا أفرطت قاعدة تنظيف
  if (!cleaned && original) {
    return original.replace(/\n{3,}/g, '\n\n').trim();
  }

  return cleaned;
}

export function validateReportPayload(data = {}) {
  const cleanedReport = cleanReportText(data.report || '');
  const hasReport = cleanedReport.length > 0;
  const hasSources = Array.isArray(data.sources) && data.sources.length > 0;
  const hasAnalysis =
    data.analysis &&
    typeof data.analysis === 'object' &&
    Object.keys(data.analysis).length > 0;

  return {
    report: cleanedReport,
    isComplete: hasReport,
    isPartial: !hasReport && (hasSources || hasAnalysis),
  };
}
