import logging
import json
from llm_client import generate_ai_response

logger = logging.getLogger(__name__)

async def analyze_sources(topic: str, read_sources: list) -> dict:
    """
    يستقبل موضوع البحث ومحتوى المصادر، ويقوم بتحليلها باستخدام Google Gemini API.
    """
    sources_text = ""
    for idx, source in enumerate(read_sources, 1):
        sources_text += f"\n--- Source {idx}: {source.get('title')} ---\n"
        sources_text += f"URL: {source.get('url')}\n"
        sources_text += f"Content: {source.get('content', '')[:2000]}\n"

    prompt = f"""
You are an expert AI Research Analyst.
Your task is to analyze the following research sources related to the topic and synthesize the findings.

Research Topic: {topic}

Sources Data:
{sources_text}

Return a JSON object containing:
1. "key_findings": A list of 4 to 6 core findings, facts, or insights extracted from the sources.
2. "synthesized_analysis": A comprehensive summary paragraph analyzing the collected information and comparing perspectives.
3. "reliable_sources": A list of sources used with their titles and URLs.
"""

    try:
        logger.info(f"Analyzing sources for topic: {topic}")
        
        raw_text = generate_ai_response(
            prompt=prompt,
            system_instruction="You are a precise JSON-only output assistant for research analysis.",
            json_mode=True,
            temperature=0.3
        )
        
        analysis_data = json.loads(raw_text.strip())
        
        return {
            "success": True,
            "analysis": analysis_data
        }
        
    except Exception as e:
        logger.exception("Analyst failed to process sources")
        return {
            "success": False,
            "error": str(e),
            "raw_response": locals().get("raw_text", "")
        }