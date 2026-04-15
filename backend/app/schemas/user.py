from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    extracted_skills: Optional[Dict[str, List[str]]] = None
    experience_level: Optional[str] = None
    target_role: Optional[str] = None
    current_readiness_score: Optional[float] = None

class UserOut(UserBase):
    id: int
    extracted_skills: Dict[str, List[str]]
    experience_level: Optional[str]
    target_role: Optional[str]
    current_readiness_score: float
    future_readiness_score: float
    phone_number: Optional[str] = None
    mentor_id: Optional[int] = None
    mentorship_code: Optional[str] = None

    class Config:
        from_attributes = True

class ConnectRequest(BaseModel):
    code: str
    admin_id: int

class CodeRequest(BaseModel):
    user_id: int
