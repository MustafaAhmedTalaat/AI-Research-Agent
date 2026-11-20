import logging
from llm_client import generate_ai_response

logger = logging.getLogger(__name__)

async def plan_research(topic: str, description: str = "", depth: str = "medium") -> dict:
    """
    يستقبل موضوع البحث ويقوم بتحليله وتخطيطه باستخدام Google Gemini API.
    """
    prompt = f"""
You are an expert AI Research Planner. 
Your task is to analyze the following research topic and create a structured research plan.

Research Topic: {topic}
Additional Description: {description}
Research Depth: {depth}

Return a JSON object containing:
1. "title": A refined title for the research.
2. "sub_questions": A list of 3 to 5 specific sub-questions to answer.
3. "search_queries": A list of 3 to 4 optimized search engine queries to gather information.
"""

    try:
        logger.info(f"Generating research plan for topic: {topic}")
        
        # استدعاء دالة Gemini مع تفعيل الـ JSON Mode
        raw_text = generate_ai_response(
            prompt=prompt,
            system_instruction="You are a precise JSON-only output assistant for research planning.",
            json_mode=True,
            temperature=0.2
        )
        
        import json
        plan_data = json.loads(raw_text.strip())
        
        return {
            "success": True,
            "plan": plan_data
        }
        
    except Exception as e:
        logger.exception("Planner failed to generate research plan")
        return {
            "success": False,
            "error": str(e),
            "raw_response": locals().get("raw_text", "")
        }