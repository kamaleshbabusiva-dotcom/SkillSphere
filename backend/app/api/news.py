from fastapi import APIRouter, Query
from typing import Optional
from app.services.news import fetch_ai_news

router = APIRouter()


@router.get("/")
async def get_news(
    category: Optional[str] = Query(None, description="Filter by 'ai' or 'technology'"),
    trusted: Optional[bool] = Query(False, description="Return only trusted sources when true"),
):
    """
    Get the latest news. Optional `category` query can be `ai` or `technology`.
    """
    news = await fetch_ai_news(category=category, trusted=trusted)
    return news
