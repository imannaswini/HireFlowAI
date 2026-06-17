import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base

# Import all models to ensure they are registered with Base metadata
from app.models import User, Company, Job, Candidate, MatchFactor, InterviewQuestion

# Automate table generation on startup for convenience
Base.metadata.create_all(bind=engine)

from app.routers import auth, jobs, candidates, analytics, interview

app = FastAPI(
    title="HireFlow AI Recruiter Copilot API",
    description="Explainable Recruiter Core Backend Services",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(analytics.router)
app.include_router(interview.router)

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "service": "HireFlow AI Recruiter API Core",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
