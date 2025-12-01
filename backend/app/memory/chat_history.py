import json
from typing import List, Dict
from datetime import datetime
from app.config import get_settings

settings = get_settings()

class ChatHistory:
    def __init__(self):
        self.file_path = settings.CHAT_HISTORY_FILE
    
    def add_message(self, role: str, content: str):
        """Add a message to chat history"""
        history = self.get_history()
        history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 50 messages
        if len(history) > 50:
            history = history[-50:]
        
        self._save_history(history)
    
    def get_history(self, limit: int = 10) -> List[Dict]:
        """Get recent chat history"""
        try:
            with open(self.file_path, 'r') as f:
                history = json.load(f)
                return history[-limit:] if limit else history
        except Exception as e:
            print(f"Error reading chat history: {e}")
            return []
    
    def _save_history(self, history: List[Dict]):
        """Save chat history to file"""
        try:
            with open(self.file_path, 'w') as f:
                json.dump(history, f, indent=2)
        except Exception as e:
            print(f"Error saving chat history: {e}")
    
    def clear_history(self):
        """Clear all chat history"""
        self._save_history([])

# Global instance
chat_history = ChatHistory()