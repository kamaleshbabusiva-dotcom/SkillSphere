from sqlalchemy import Column, Integer, String, JSON, Float
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    
    # Skill Profile
    extracted_skills = Column(JSON, default={})  # { "Technical": ["Python", "K8s"], "Soft": ["Teamwork"] }
    experience_level = Column(String)  # Junior, Mid, Senior, Principal
    target_role = Column(String)
    
    # Career Insights
    current_readiness_score = Column(Float, default=0.0)
    future_readiness_score = Column(Float, default=0.0)
    
    phone_number = Column(String, nullable=True)
    
    # Mentorship Linkage
    mentor_id = Column(Integer, nullable=True) # ID of the mentor/admin
    mentorship_code = Column(String, unique=True, index=True, nullable=True) # 6-digit code
