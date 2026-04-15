from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "SkillSphere AI"
    DATABASE_URL: str = "sqlite:///./skillsphere.db"
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    # Vapi (voice) integration
    VAPI_API_KEY: Optional[str] = None
    VAPI_ASSISTANT_ID: Optional[str] = None
    
    # news integration
    GNEWS_API_KEY: Optional[str] = None

    JWT_SECRET: str = "your-secret-key"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
