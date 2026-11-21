import { jsPDF } from 'jspdf';
import { cleanReportText } from './reportCleaner';

export function exportReportMarkdown(report) {
  const cleanBody = cleanReportText(report.report || '');
  const safeName = (report.topic || 'research_report')
    .trim()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const content = [
    `# ${report.topic || 'Research Report'}`,
    '',
    cleanBody,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName || 'research_report'}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportPDF(report) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - marginX * 2;
  let cursorY = 56;

  const ensureSpace = (neededHeight) => {
    if (cursorY + neededHeight > pageHeight - 48) {
      doc.addPage();
      cursorY = 56;
    }
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(report.topic || 'AI Research Report', maxLineWidth);
  doc.text(titleLines, marginX, cursorY);
  cursorY += titleLines.length * 24 + 14;

  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  const cleanBody = cleanReportText(report.report || '')
    .replace(/[#*_`>-]/g, '')
    .replace(/\n{3,}/g, '\n\n');

  const paragraphs = cleanBody.split('\n');
  paragraphs.forEach((para) => {
    if (!para.trim()) {
      cursorY += 10;
      return;
    }
    const wrapped = doc.splitTextToSize(para, maxLineWidth);
    wrapped.forEach((line) => {
      ensureSpace(18);
      doc.text(line, marginX, cursorY);
      cursorY += 16;
    });
    cursorY += 4;
  });

  const safeName = (report.topic || 'research_report')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_');
  doc.save(`${safeName || 'research_report'}.pdf`);
}