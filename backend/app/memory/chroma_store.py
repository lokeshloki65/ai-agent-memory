from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from typing import List, Dict
import chromadb
from app.config import get_settings

settings = get_settings()

class MemoryStore:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        
        self.vectorstore = Chroma(
            collection_name="user_memories",
            embedding_function=self.embeddings,
            persist_directory=str(settings.CHROMA_DIR)
        )
    
    def add_memory(self, text: str, metadata: Dict = None):
        """Add a new memory to the vector store"""
        doc = Document(
            page_content=text,
            metadata=metadata or {}
        )
        self.vectorstore.add_documents([doc])
        self.vectorstore.persist()
    
    def search_memories(self, query: str, k: int = 5) -> List[Document]:
        """Search for relevant memories"""
        return self.vectorstore.similarity_search(query, k=k)
    
    def get_all_memories(self) -> List[Dict]:
        """Retrieve all stored memories"""
        try:
            collection = self.vectorstore._collection
            results = collection.get()
            
            memories = []
            if results and results['documents']:
                for i, doc in enumerate(results['documents']):
                    memories.append({
                        'content': doc,
                        'metadata': results['metadatas'][i] if results['metadatas'] else {}
                    })
            return memories
        except Exception as e:
            print(f"Error retrieving memories: {e}")
            return []
    
    def clear_memories(self):
        """Clear all memories"""
        try:
            self.vectorstore.delete_collection()
            self.vectorstore = Chroma(
                collection_name="user_memories",
                embedding_function=self.embeddings,
                persist_directory=str(settings.CHROMA_DIR)
            )
        except Exception as e:
            print(f"Error clearing memories: {e}")

# Global instance
memory_store = MemoryStore()