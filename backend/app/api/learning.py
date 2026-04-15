from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.learning import generate_weekly_learning_path

router = APIRouter()


class LearningRequest(BaseModel):
    target_role: str
    focus_skills: Optional[List[str]] = None


@router.post("/", summary="Generate 7-day learning path")
async def create_learning_path(req: LearningRequest):
    """Return a simple 7-day learning path for the requested role."""
    schedule = generate_weekly_learning_path(req.target_role, req.focus_skills)
    return schedule
