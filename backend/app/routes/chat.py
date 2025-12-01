from faster_whisper import WhisperModel
from pathlib import Path
import os

class STTService:
    def __init__(self):
        # Use tiny model for speed (you can change to 'base', 'small', 'medium' for better accuracy)
        self.model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    
    def transcribe_audio(self, audio_path: str) -> str:
        """Transcribe audio file to text"""
        try:
            segments, info = self.model.transcribe(audio_path, beam_size=5)
            
            # Combine all segments
            transcription = " ".join([segment.text for segment in segments])
            
            # Clean up the audio file
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
            return transcription.strip()
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""

# Global instance
stt_service = STTService()