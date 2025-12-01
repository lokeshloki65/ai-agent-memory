from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from typing import List, Dict
from app.config import get_settings
from app.memory.chroma_store import memory_store

settings = get_settings()

class GeminiService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.7,
            convert_system_message_to_human=True
        )
    
    def generate_response(self, user_message: str, chat_history: List[Dict] = None) -> str:
        """Generate a response using Gemini with memory context"""
        
        # Search for relevant memories
        relevant_memories = memory_store.search_memories(user_message, k=3)
        
        # Build context from memories
        memory_context = ""
        if relevant_memories:
            memory_context = "\n\nRelevant information I remember about you:\n"
            for mem in relevant_memories:
                memory_context += f"- {mem.page_content}\n"
        
        # Build system prompt
        system_prompt = f"""You are a helpful AI assistant with long-term memory. 
You remember facts about the user and use them to provide personalized responses.
Be friendly, concise, and natural in your responses.{memory_context}

If the user tells you something new about themselves (like their name, preferences, etc.), 
acknowledge it naturally in your response."""
        
        # Build message history
        messages = [SystemMessage(content=system_prompt)]
        
        if chat_history:
            for msg in chat_history[-5:]:  # Last 5 messages for context
                if msg['role'] == 'user':
                    messages.append(HumanMessage(content=msg['content']))
                elif msg['role'] == 'assistant':
                    messages.append(AIMessage(content=msg['content']))
        
        messages.append(HumanMessage(content=user_message))
        
        # Get response
        response = self.llm.invoke(messages)
        
        # Extract and store new memories from user message
        self._extract_and_store_memories(user_message)
        
        return response.content
    
    def _extract_and_store_memories(self, user_message: str):
        """Extract important information from user message and store as memory"""
        # Simple patterns to detect user information
        memory_triggers = [
            "my name is",
            "i am",
            "i like",
            "i love",
            "i prefer",
            "i work as",
            "i live in",
            "my favorite"
        ]
        
        user_message_lower = user_message.lower()
        
        for trigger in memory_triggers:
            if trigger in user_message_lower:
                # Store the entire sentence as a memory
                memory_store.add_memory(
                    text=user_message,
                    metadata={"type": "user_info", "trigger": trigger}
                )
                break

# Global instance
gemini_service = GeminiService()