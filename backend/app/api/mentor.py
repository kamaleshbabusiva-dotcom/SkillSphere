from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import random
import string
from app.services.mentor import mentor_service
from app.services.voice_service import voice_service
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import ConnectRequest, CodeRequest

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    language: Optional[str] = "English"

class CallRequest(BaseModel):
    phone_number: str
    user_context: Optional[dict] = {}

@router.post("/chat")
async def chat_with_mentor(request: ChatRequest):
    try:
        # Convert history format for service
        history_list = [{"role": msg.role, "content": msg.content} for msg in request.history]
        response = await mentor_service.get_career_advice(
            request.message, 
            history_list, 
            target_language=request.language
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-code")
async def generate_mentorship_code(request: CodeRequest, db: Session = Depends(get_db)):
    """Generates a unique 6-digit connection code for a user."""
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    user.mentorship_code = code
    db.commit()
    return {"code": code}

@router.post("/connect")
async def connect_mentor(request: ConnectRequest, db: Session = Depends(get_db)):
    """Pairs an admin/mentor to a user via code."""
    # Find user with the code
    user = db.query(User).filter(User.mentorship_code == request.code).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid connection code")
    
    # Link administrative mentor
    user.mentor_id = request.admin_id
    user.mentorship_code = None  # Clear code once used
    db.commit()
    
    return {"success": True, "mentee_name": user.full_name}

@router.post("/call")
async def call_user(request: CallRequest):
    """
    Trigger an AI voice call to the user.
    """
    try:
        result = await voice_service.initiate_call(
            request.phone_number, 
            request.user_context
        )
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=400, detail=result["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
