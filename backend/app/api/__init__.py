from fastapi import APIRouter
from . import skills, mentor, connect, news, learning

router = APIRouter()

router.include_router(skills.router, prefix="/skills", tags=["skills"])
router.include_router(mentor.router, prefix="/mentor", tags=["mentor"])
router.include_router(connect.router, prefix="/connect", tags=["connect"])
router.include_router(news.router, prefix="/news", tags=["news"])
router.include_router(learning.router, prefix="/learning", tags=["learning"])
