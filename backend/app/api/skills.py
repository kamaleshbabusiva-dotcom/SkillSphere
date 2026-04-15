from fastapi import APIRouter, UploadFile, File, Depends
from typing import List, Dict
from app.services.skill_intelligence import skill_service
from app.services.gap_analysis import gap_service
from app.services.prediction import prediction_service
from app.services.transformation import transformation_service
from app.services.role_intelligence import role_service

router = APIRouter()

@router.post("/extract")
async def extract_skills(file: UploadFile = File(...)):
    # Read file content
    content = await file.read()
    
    # Process with AI Intelligence Service
    result = await skill_service.analyze_resume(file_bytes=content, filename=file.filename)
    return result

@router.get("/roles")
async def list_roles():
    return role_service.list_roles()

@router.post("/analyze-gap")
async def analyze_gap(user_skills: List[str], target_role: str):
    analysis = gap_service.compute_match(user_skills, target_role)
    return analysis

@router.post("/predict-future")
async def predict_future(user_skills: List[str], target_role: str):
    future_skills = await prediction_service.predict_future_skills(user_skills, target_role)
    return future_skills

@router.post("/generate-roadmap")
async def generate_roadmap(missing_skills: List[str], target_role: str):
    roadmap = await transformation_service.generate_roadmap(missing_skills, target_role)
    return roadmap
