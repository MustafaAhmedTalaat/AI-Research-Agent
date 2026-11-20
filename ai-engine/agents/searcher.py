import logging
from ddgs import DDGS

logger = logging.getLogger(__name__)


async def search_web(queries: list, max_results: int = 3) -> dict:
    """
    يستقبل قائمة من كلمات البحث (Search Queries) ويبحث عنها عبر DDGS،
    ويستخرج الروابط والعناوين والمقتطفات المفيدة مع تجاوز أخطاء الاتصال المؤقتة لكل استعلام.
    """
    all_results = []
    seen_urls = set()

    try:
        with DDGS(timeout=10) as ddgs:
            for query in queries:
                try:
                    logger.info(f"Searching DuckDuckGo for query: {query}")
                    results = list(ddgs.text(query, max_results=max_results))

                    for r in results:
                        url = r.get("href")
                        if url and url not in seen_urls:
                            seen_urls.add(url)
                            all_results.append({
                                "title": r.get("title"),
                                "url": url,
                                "snippet": r.get("body"),
                            })
                except Exception as query_err:
                    logger.warning(f"Search query failed ('{query}'): {query_err}")
                    continue

        logger.info(f"Successfully gathered {len(all_results)} unique sources from web.")
        return {
            "success": True,
            "sources": all_results,
        }

    except Exception as e:
        logger.exception("Web search initialization failed")
        return {
            "success": True,
            "sources": all_results,
        }