import logging
from llm_client import generate_ai_response

logger = logging.getLogger(__name__)

async def write_report(topic: str, analysis_data: dict, language: str = "Arabic") -> dict:
    """
    يستقبل موضوع البحث والتحليل، ويكتب التقرير النهائي بصيغة Markdown باستخدام Google Gemini API.
    """
    key_findings = analysis_data.get("key_findings", [])
    synthesized_analysis = analysis_data.get("synthesized_analysis", "")
    reliable_sources = analysis_data.get("reliable_sources", [])

    findings_text = "\n".join([f"- {f}" for f in key_findings])
    sources_text = "\n".join([f"- [{s.get('title')}]({s.get('url')})" for s in reliable_sources])

    prompt = f"""
You are an expert Professional Report Writer and Researcher.
Your task is to write a comprehensive, highly structured, and well-organized research report in {language}.

Research Topic: {topic}

Core Findings:
{findings_text}

Synthesized Analysis:
{synthesized_analysis}

Please write a complete research report in Markdown format containing:
1. Executive Summary / Introduction
2. Detailed Analysis & Key Insights (expanding on the findings and analysis)
3. Conclusion & Recommendations
4. References & Sources (list the provided sources)

Make it professional, academic, and engaging. Return ONLY the markdown content of the report.
"""

    try:
        logger.info(f"Writing final report for topic: {topic} in {language}")
        
        report_content = generate_ai_response(
            prompt=prompt,
            system_instruction="You are a professional research report writer. Write clear, detailed, and well-structured Markdown reports.",
            json_mode=False,
            temperature=0.3
        )
        
        if "References" not in report_content and "المصادر" not in report_content:
            report_content += f"\n\n## References & Sources\n{sources_text}"

        return {
            "success": True,
            "report": report_content
        }
        
    except Exception as e:
        logger.exception("Writer failed to generate report")
        return {
            "success": False,
            "error": str(e),
            "report": ""
        }