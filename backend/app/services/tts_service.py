import edge_tts
import asyncio
from pathlib import Path
import uuid
from app.config import get_settings

settings = get_settings()

class TTSService:
    def __init__(self):
        self.voice = settings.TTS_VOICE
    
    async def text_to_speech(self, text: str) -> str:
        """Convert text to speech and return the file path"""
        # Generate unique filename
        filename = f"{uuid.uuid4()}.mp3"
        output_path = settings.TEMP_DIR / filename
        
        # Generate speech
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(output_path))
        
        return str(output_path)
    
    def text_to_speech_sync(self, text: str) -> str:
        """Synchronous wrapper for text_to_speech"""
        return asyncio.run(self.text_to_speech(text))

# Global instance
tts_service = TTSService()