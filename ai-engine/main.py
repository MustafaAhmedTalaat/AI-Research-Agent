import os
import time
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai

# استدعاء دوال الـ Agents الفردية
from agents.planner import plan_research
from agents.searcher import search_web
from agents.reader import read_sources
from agents.analyst import analyze_sources
from agents.writer import write_report

# استدعاء الـ LangGraph Workflow المتكامل
from workflow import research_app

load_dotenv()

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Research Agent")

# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5000",
    "https://ai-research-agent-three-sand.vercel.app",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    clean_url = frontend_url.rstrip("/")
    if clean_url not in allowed_origins:
        allowed_origins.append(clean_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")
    return genai.Client(api_key=api_key)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=20000)


class ResearchPlanRequest(BaseModel):
    topic: str = Field(min_length=1)
    description: str = ""
    depth: str = "medium"


class SearchRequest(BaseModel):
    queries: list[str]
    max_results: int = 3


class ReadRequest(BaseModel):
    sources: list[dict]


class AnalyzeRequest(BaseModel):
    topic: str
    read_sources: list[dict]


class WriteRequest(BaseModel):
    topic: str
    analysis_data: dict
    language: str = "Arabic"


class FullResearchRequest(BaseModel):
    topic: str = Field(min_length=1)
    description: str = ""
    depth: str = "medium"
    language: str = "Arabic"


@app.get("/")
def home():
    return {
        "message": "AI Research Agent Engine is running!",
        "status": "success",
        "engine": "gemini-cloud",
    }


@app.post("/chat")
def chat(request: ChatRequest):
    start_time = time.time()

    try:
        logger.info("Starting Gemini chat request...")
        client = get_gemini_client()
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

        response = client.models.generate_content(
            model=model_name,
            contents=request.message,
            config={
                "system_instruction": (
                    "You are an AI research assistant. "
                    "Provide clear, structured and concise answers. "
                    "Do not invent sources or references. "
                    "Distinguish verified facts from suggestions."
                ),
                "temperature": 0.3,
            },
        )

        reply = response.text or ""
        elapsed = round(time.time() - start_time, 2)

        logger.info(f"Gemini chat completed in {elapsed} seconds")

        return {
            "success": True,
            "reply": reply,
            "processing_time": elapsed,
        }

    except Exception as error:
        logger.exception("Gemini chat request failed")
        raise HTTPException(
            status_code=500,
            detail=f"AI Engine Error: {str(error)}",
        )


@app.post("/api/plan")
async def create_research_plan(request: ResearchPlanRequest):
    logger.info(f"Starting research planning for topic: {request.topic}")
    result = await plan_research(
        topic=request.topic,
        description=request.description,
        depth=request.depth,
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error in planner"))
    return result


@app.post("/api/search")
async def perform_web_search(request: SearchRequest):
    logger.info(f"Starting web search for queries: {request.queries}")
    result = await search_web(
        queries=request.queries,
        max_results=request.max_results,
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error in searcher"))
    return result


@app.post("/api/read")
async def read_web_sources(request: ReadRequest):
    logger.info(f"Starting to read {len(request.sources)} sources")
    result = await read_sources(sources=request.sources)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error in reader"))
    return result


@app.post("/api/analyze")
async def analyze_web_sources(request: AnalyzeRequest):
    logger.info(f"Starting analysis for topic: {request.topic}")
    result = await analyze_sources(
        topic=request.topic,
        read_sources=request.read_sources,
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error in analyst"))
    return result


@app.post("/api/write")
async def write_final_report(request: WriteRequest):
    logger.info(f"Starting report generation for topic: {request.topic}")
    result = await write_report(
        topic=request.topic,
        analysis_data=request.analysis_data,
        language=request.language,
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown error in writer"))
    return result


@app.post("/api/research")
async def run_full_research(request: FullResearchRequest):
    start_time = time.time()
    logger.info(f"Starting FULL LangGraph research workflow for topic: {request.topic}")

    initial_state = {
        "topic": request.topic,
        "description": request.description,
        "depth": request.depth,
        "language": request.language,
        "plan": {},
        "sources": [],
        "read_sources": [],
        "analysis": {},
        "report": "",
        "error": "",
    }

    try:
        final_state = await research_app.ainvoke(initial_state)

        if final_state.get("error"):
            raise HTTPException(status_code=500, detail=final_state["error"])

        elapsed = round(time.time() - start_time, 2)
        logger.info(f"Full research workflow completed successfully in {elapsed} seconds!")

        return {
            "success": True,
            "topic": request.topic,
            "plan": final_state.get("plan"),
            "sources_count": len(final_state.get("sources", [])),
            "sources": final_state.get("sources"),
            "analysis": final_state.get("analysis"),
            "report": final_state.get("report"),
            "processing_time": elapsed,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Full research workflow failed")
        raise HTTPException(status_code=500, detail=f"Research Workflow Error: {str(e)}")
