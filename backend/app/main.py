from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="AI Agent with Memory API",
    description="Voice & Text AI Assistant with Long-Term Memory",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
async def root():
    return {
        "message": "AI Agent with Memory API is running!",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}