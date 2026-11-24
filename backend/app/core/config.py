from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PrajaAI — Smart Village AI Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "prajaai-super-secret-jwt-key-2026-secure-hackathon")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./prajaai.db")
    
    # Gemini AI
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    
    # Uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
