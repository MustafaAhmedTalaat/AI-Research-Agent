import logging
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END

from agents.planner import plan_research
from agents.searcher import search_web
from agents.reader import read_sources
from agents.analyst import analyze_sources
from agents.writer import write_report

logger = logging.getLogger(__name__)


class ResearchState(TypedDict):
    topic: str
    description: str
    depth: str
    language: str
    plan: Dict[str, Any]
    sources: List[Dict[str, Any]]
    read_sources: List[Dict[str, Any]]
    analysis: Dict[str, Any]
    report: str
    error: str


async def run_planner(state: ResearchState) -> ResearchState:
    logger.info("--- LANGGRAPH: Running Planner ---")
    res = await plan_research(
        topic=state["topic"],
        description=state.get("description", ""),
        depth=state.get("depth", "medium"),
    )
    if not res.get("success"):
        state["error"] = res.get("error", "Planner failed")
    else:
        state["plan"] = res.get("plan", {})
    return state


async def run_searcher(state: ResearchState) -> ResearchState:
    logger.info("--- LANGGRAPH: Running Searcher ---")
    plan = state.get("plan", {})
    queries = plan.get("search_queries", [state["topic"]])

    res = await search_web(queries=queries, max_results=3)
    if not res.get("success"):
        state["error"] = res.get("error", "Searcher failed")
    else:
        state["sources"] = res.get("sources", [])
    return state


async def run_reader(state: ResearchState) -> ResearchState:
    logger.info("--- LANGGRAPH: Running Reader ---")
    sources = state.get("sources", [])

    res = await read_sources(sources=sources)
    if not res.get("success"):
        state["error"] = res.get("error", "Reader failed")
    else:
        state["read_sources"] = res.get("read_sources", [])
    return state


async def run_analyst(state: ResearchState) -> ResearchState:
    logger.info("--- LANGGRAPH: Running Analyst ---")
    read_sources_list = state.get("read_sources", [])

    res = await analyze_sources(
        topic=state["topic"],
        read_sources=read_sources_list,
    )
    if not res.get("success"):
        state["error"] = res.get("error", "Analyst failed")
    else:
        state["analysis"] = res.get("analysis", {})
    return state


async def run_writer(state: ResearchState) -> ResearchState:
    logger.info("--- LANGGRAPH: Running Writer ---")
    analysis_data = state.get("analysis", {})

    res = await write_report(
        topic=state["topic"],
        analysis_data=analysis_data,
        language=state.get("language", "Arabic"),
    )
    if not res.get("success"):
        state["error"] = res.get("error", "Writer failed")
    else:
        state["report"] = res.get("report", "")
    return state


def check_error(state: ResearchState) -> str:
    return "end" if state.get("error") else "continue"


def build_research_graph():
    workflow = StateGraph(ResearchState)

    workflow.add_node("planner", run_planner)
    workflow.add_node("searcher", run_searcher)
    workflow.add_node("reader", run_reader)
    workflow.add_node("analyst", run_analyst)
    workflow.add_node("writer", run_writer)

    workflow.set_entry_point("planner")

    workflow.add_conditional_edges(
        "planner", check_error, {"continue": "searcher", "end": END}
    )
    workflow.add_conditional_edges(
        "searcher", check_error, {"continue": "reader", "end": END}
    )
    workflow.add_conditional_edges(
        "reader", check_error, {"continue": "analyst", "end": END}
    )
    workflow.add_conditional_edges(
        "analyst", check_error, {"continue": "writer", "end": END}
    )
    workflow.add_edge("writer", END)

    return workflow.compile()


research_app = build_research_graph()