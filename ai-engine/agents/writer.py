import logging
import re
from llm_client import generate_ai_response

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = """
You are a senior research writer producing concise, high-signal, publication-grade reports
in the requested language (Arabic or English).

Core principles:
- Prioritize clarity, precision, and brevity without losing essential facts, nuances, caveats,
  warnings, trade-offs, quantitative metrics, or verifiable sources.
- Eliminate fluff, lengthy introductions, repetitive points across sections, meta-commentary about
  how the report was produced, developer notes, generic advice detached from the topic, and
  empty closing lines (such as "End of report" or offers for further help).
- Adapt the structure naturally to the topic rather than forcing identical templates: use a clear
  title, a concise opening overview, logical headings/subheadings, short focused paragraphs,
  bullet points for key takeaways, Markdown tables when comparing options or presenting numerical
  data, brief practical examples when helpful, and a concise summary of core conclusions.
- Output clean, valid Markdown only.
""".strip()


def _clean_generated_markdown(text: str) -> str:
    if not isinstance(text, str):
        return ""

    cleaned = text.strip()
    if not cleaned:
        return ""

    # إزالة كتل التفكير أو العبارات التمهيدية والختامية الفارغة إن وُجدت
    cleaned = re.sub(r"<think>[\s\S]*?</think>\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(
        r"^(sure[,!.]?|certainly[,!.]?|here is|here's|بالتأكيد|إليك|فيما يلي).*?[:.\n]+",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(
        r"\n+(نهاية التقرير|انتهى التقرير|end of report|please let me know if you need anything else)\s*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned


def _format_sources(reliable_sources: list) -> str:
    if not isinstance(reliable_sources, list):
        return ""

    lines = []
    seen = set()
    for src in reliable_sources:
        if not isinstance(src, dict):
            continue
        title = (src.get("title") or src.get("url") or "Source").strip()
        url = (src.get("url") or "").strip()
        key = (title.lower(), url.lower())
        if key in seen:
            continue
        seen.add(key)
        if url:
            lines.append(f"- [{title}]({url})")
        else:
            lines.append(f"- {title}")

    return "\n".join(lines)


async def write_report(topic: str, analysis_data: dict, language: str = "Arabic") -> dict:
    """
    يستقبل موضوع البحث والتحليل، ويكتب التقرير النهائي بصيغة Markdown
    بشكل منظم ومختصر ودقيق ومتوافق مع لغة الطلب.
    """
    analysis_data = analysis_data if isinstance(analysis_data, dict) else {}
    key_findings = analysis_data.get("key_findings") or []
    synthesized_analysis = (analysis_data.get("synthesized_analysis") or "").strip()
    reliable_sources = analysis_data.get("reliable_sources") or []

    findings_text = "\n".join([f"- {str(f).strip()}" for f in key_findings if str(f).strip()])
    sources_text = _format_sources(reliable_sources)

    is_arabic = language.strip().lower() in {"arabic", "ar", "العربية"}
    target_lang = "Arabic" if is_arabic else "English"
    sources_heading = "## المصادر والمراجع" if is_arabic else "## References & Sources"

    prompt = f"""
Write a focused, clear, and well-structured research report in {target_lang}.

Topic: {topic.strip()}

Key Findings:
{findings_text if findings_text else "No structured bullet findings provided; rely on the synthesized analysis."}

Synthesized Analysis:
{synthesized_analysis if synthesized_analysis else "No synthesized analysis text provided; summarize core insights directly from the topic and sources."}

Available Sources:
{sources_text if sources_text else "None provided."}

Instructions:
1. Write strictly in {target_lang}.
2. Keep it concise, informative, and free of repetition, filler, meta-talk, and generic padding.
3. Retain all important facts, warnings, exceptions, trade-offs, and numbers from the inputs.
4. Structure the report naturally to fit the topic (clear title, brief intro, focused sections/bullets, Markdown table if comparing items or figures, brief example if helpful, short conclusion with key takeaways, and a concise references list when sources exist).
5. Return ONLY the Markdown report.
""".strip()

    try:
        logger.info(f"Writing final report for topic: {topic} in {target_lang}")

        raw_content = generate_ai_response(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
            json_mode=False,
            temperature=0.25,
        )

        report_content = _clean_generated_markdown(raw_content)
        if not report_content:
            return {
                "success": False,
                "error": "Generated report content is empty.",
                "report": "",
            }

        has_sources_section = bool(
            re.search(r"^#{1,3}\s*(references|sources|المصادر|المراجع)", report_content, re.MULTILINE | re.IGNORECASE)
        )
        if sources_text and not has_sources_section:
            report_content = f"{report_content}\n\n{sources_heading}\n{sources_text}"

        return {
            "success": True,
            "report": report_content,
        }

    except Exception as e:
        logger.exception("Writer failed to generate report")
        return {
            "success": False,
            "error": str(e),
            "report": "",
        }
