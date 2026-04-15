from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.connect_chat import connect_chat_service

router = APIRouter()


class ConnectChatMessage(BaseModel):
    role: str
    content: str


class ConnectChatRequest(BaseModel):
    message: str
    history: Optional[List[ConnectChatMessage]] = []


@router.post("/chat")
async def connect_chat(request: ConnectChatRequest):
    """AI-powered chat for Connect meeting sessions."""
    try:
        history_list = [
            {"role": msg.role, "content": msg.content}
            for msg in request.history
        ]
        response = await connect_chat_service.get_response(
            request.message, history_list
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
