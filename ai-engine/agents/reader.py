import logging
import httpx
import trafilatura

logger = logging.getLogger(__name__)

async def fetch_and_read_url(url: str) -> str:
    """
    يقوم بفتح رابط معين، تحميل محتواه، واستخراج النص الصافي باستخدام trafilatura.
    """
    try:
        logger.info(f"Fetching content from URL: {url}")
        
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            if response.status_code != 200:
                logger.warning(f"Failed to fetch URL {url}, status code: {response.status_code}")
                return ""
            
            html_content = response.text
            
        # استخراج النص الصافي باستخدام trafilatura
        extracted_text = trafilatura.extract(html_content, include_comments=False, include_tables=True)
        
        if extracted_text:
            # تقليص النص لو كان طويل جداً عشان يتناسب مع الـ Context window
            return extracted_text[:4000]
        
        return ""
        
    except Exception as e:
        logger.error(f"Error reading URL {url}: {str(e)}")
        return ""

async def read_sources(sources: list) -> list:
    """
    يستقبل قائمة المصادر (الروابط) ويقوم بقراءة محتوى كل مصدر وتحديثه بالنص المستخرج.
    """
    read_results = []
    
    for source in sources:
        url = source.get("url")
        if not url:
            continue
            
        content = await fetch_and_read_url(url)
        
        if content:
            read_results.append({
                "title": source.get("title"),
                "url": url,
                "snippet": source.get("snippet"),
                "content": content
            })
        else:
            # لو فشل في قراءة الصفحة، نحتفظ بالـ snippet العادية على الأقل
            read_results.append({
                "title": source.get("title"),
                "url": url,
                "snippet": source.get("snippet"),
                "content": source.get("snippet", "")
            })
            
    logger.info(f"Successfully read and processed {len(read_results)} sources.")
    return {
        "success": True,
        "read_sources": read_results
    }