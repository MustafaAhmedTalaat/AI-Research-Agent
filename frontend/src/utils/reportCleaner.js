const FILLER_PREFIX_PATTERNS = [
  /^(sure[,!.]?|certainly[,!.]?|of course[,!.]?|here is|here's)\s+.*?(report|analysis|overview|summary|response|guide).*?[:.\n]+/i,
  /^(بالتأكيد|حسناً|إليك|فيما يلي|هذا هو)\s+.*?(التقرير|البحث|الملخص|التحليل|العرض).*?[:.\n]+/i,
  /^(based on the (provided |search )?sources[,:]?|according to the retrieved (information|sources)[,:]?)\s*/i,
  /^(بناءً على المصادر (المقدمة|المتاحة|المستخرجة)[،:]*|وفقاً للمعلومات المستخرجة[،:]*)\s*/i,
  /^<think>[\s\S]*?<\/think>\s*/gi,
];

const FILLER_SUFFIX_PATTERNS = [
  /\n{1,3}(please let me know if you (need|would like|want) (more|any|further)[\s\S]*$)/i,
  /\n{1,3}(feel free to ask if you have any (questions|follow-ups)[\s\S]*$)/i,
  /\n{1,3}(إذا كنت بحاجة إلى (أي استفسارات|المزيد من التفاصيل|تعديلات إضافية)[\s\S]*$)/i,
  /\n{1,3}(لا تتردد في طرح أي أسئلة إضافية[\s\S]*$)/i,
];

export function cleanReportText(rawText = '') {
  if (typeof rawText !== 'string') return '';

  let cleaned = rawText.trim();

  // إزالة كتل التفكير أو المقدمات الروتينية في بداية النص
  for (const pattern of FILLER_PREFIX_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  // إزالة الخاتمات التفاعلية أو العروض الجانبية في نهاية النص
  for (const pattern of FILLER_SUFFIX_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  // إزالة السطور الفارغة المتكررة الزائدة (أكثر من سطرين)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}