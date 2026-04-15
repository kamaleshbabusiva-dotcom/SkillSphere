import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.config import settings

GNEWS_API_URL = "https://gnews.io/api/v4/search"

MOCK_AI_NEWS = [
    {
        "title": "OpenAI Unveils Next-Gen GPT-5 with Enhanced Logical Reasoning",
        "description": "OpenAI has officially announced GPT-5, claiming significant breakthroughs in multi-step reasoning and mathematical capabilities.",
        "url": "https://openai.com",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        "publishedAt": "2026-04-15T12:00:00Z",
        "source": {"name": "OpenAI Blog"}
    },
    {
        "title": "NVIDIA Blackwell B200 GPUs Start Mass Shipments to Cloud Providers",
        "description": "The latest AI infrastructure powerhouse, the B200, is now being deployed at scale to major cloud hyperscalers like AWS and Azure.",
        "url": "https://nvidia.com",
        "image": "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800",
        "publishedAt": "2026-04-14T15:30:00Z",
        "source": {"name": "TechCrunch"}
    },
    {
        "title": "Anthropic's Claude 4 Set to Launch with Record-Breaking Context Window",
        "description": "Rumors suggest Claude 4 will support up to 2 million tokens, allowing for analysis of entire codebases in a single prompt.",
        "url": "https://anthropic.com",
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
        "publishedAt": "2026-04-15T09:15:00Z",
        "source": {"name": "The Verge"}
    },
    {
        "title": "DeepMind's AlphaFold 4 Accelerates Drug Discovery for Rare Diseases",
        "description": "Google DeepMind's latest iteration of AlphaFold can now predict interaction dynamics, potentially cutting drug discovery time in half.",
        "url": "https://deepmind.google",
        "image": "https://images.unsplash.com/photo-1532187875605-1ef6c13909p?auto=format&fit=crop&q=80&w=800",
        "publishedAt": "2026-04-13T11:00:00Z",
        "source": {"name": "Wired"}
    }
]

async def fetch_ai_news(category: Optional[str] = None, trusted: Optional[bool] = False) -> List[Dict[str, Any]]:
    """
    Fetches the latest AI news from GNews.
    If no API key is provided or the request fails, returns mock data.
    """
    # Helper to parse ISO timestamps (handles 'Z')
    def _parse_date(s: str) -> datetime:
        if not s:
            return datetime.min
        try:
            return datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return datetime.min

    # Only return mock data if no API key is configured
    use_mock = not bool(settings.GNEWS_API_KEY)

    params = {
        "q": "artificial intelligence OR machine learning OR LLM OR generative AI OR technology OR tech",
        "lang": "en",
        "max": 12,
        "token": settings.GNEWS_API_KEY or "",
        "sortBy": "publishedAt"
    }

    try:
        articles: List[Dict[str, Any]] = []

        if use_mock:
            articles = MOCK_AI_NEWS.copy()
        else:
            async with httpx.AsyncClient() as client:
                response = await client.get(GNEWS_API_URL, params=params, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", []) or []
                else:
                    # Non-200 from provider — fall back to mock
                    articles = MOCK_AI_NEWS.copy()

        # Build keywords list based on requested category
        base_keywords = [
            "ai",
            "artificial intelligence",
            "machine learning",
            "llm",
            "generative",
            "deep learning",
            "neural",
            "openai",
            "anthropic",
            "nvidia",
        ]

        tech_keywords = [
            "technology",
            "tech",
            "cloud",
            "infrastructure",
            "gpu",
            "semiconductor",
        ]

        if category and category.lower() == "technology":
            keywords = tech_keywords + base_keywords
        elif category and category.lower() == "ai":
            keywords = base_keywords
        else:
            # default: combine both sets
            keywords = base_keywords + tech_keywords

        def is_relevant(a: Dict[str, Any]) -> bool:
            title = (a.get("title") or "").lower()
            desc = (a.get("description") or "").lower()
            source = (a.get("source", {}).get("name") or "").lower()
            text = " ".join([title, desc, source])
            return any(k in text for k in keywords)

        filtered = [a for a in articles if is_relevant(a)]

        # If filtering removed everything, fall back to a small set of mock AI news
        if not filtered:
            filtered = MOCK_AI_NEWS.copy()

        # Trusted sources list — prefer these when requested
        trusted_sources = [
            "wikipedia",
            "wired",
            "techcrunch",
            "the verge",
            "arstechnica",
            "bbc",
            "nytimes",
            "reuters",
            "forbes",
            "bloomberg",
        ]

        def is_trusted(a: Dict[str, Any]) -> bool:
            src = (a.get("source", {}).get("name") or "").lower()
            url = (a.get("url") or "").lower()
            for t in trusted_sources:
                if t in src or t in url:
                    return True
            return False

        # Sort by publishedAt descending (newest first)
        filtered_sorted = sorted(
            filtered,
            key=lambda a: _parse_date(a.get("publishedAt", "")),
            reverse=True,
        )

        # If trusted-only requested, prefer trusted results
        if trusted:
            trusted_filtered = [a for a in filtered_sorted if is_trusted(a)]
            final = trusted_filtered if trusted_filtered else filtered_sorted
        else:
            # prefer trusted items first, then others
            trusted_items = [a for a in filtered_sorted if is_trusted(a)]
            other_items = [a for a in filtered_sorted if not is_trusted(a)]
            final = trusted_items + other_items

        # Normalize output: return only expected fields (limit to 12)
        normalized = []
        for a in final[:12]:
            normalized.append({
                "title": a.get("title"),
                "description": a.get("description"),
                "url": a.get("url"),
                "image": a.get("image"),
                "publishedAt": a.get("publishedAt"),
                "source": {"name": a.get("source", {}).get("name")},
            })

        return normalized
    except Exception as e:
        print(f"Error fetching or processing news: {e}")
        return MOCK_AI_NEWS
