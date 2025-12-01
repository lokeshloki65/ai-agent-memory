from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    TEMP_DIR: Path = BASE_DIR / "temp"
    CHROMA_DIR: Path = DATA_DIR / "chroma_db"
    CHAT_HISTORY_FILE: Path = DATA_DIR / "chat_history.json"
    
    # TTS Settings
    TTS_VOICE: str = "en-US-ChristopherNeural"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    
    # Create directories if they don't exist
    settings.DATA_DIR.mkdir(exist_ok=True)
    settings.TEMP_DIR.mkdir(exist_ok=True)
    settings.CHROMA_DIR.mkdir(exist_ok=True)
    
    # Create chat history file if it doesn't exist
    if not settings.CHAT_HISTORY_FILE.exists():
        settings.CHAT_HISTORY_FILE.write_text("[]")
    
    return settings