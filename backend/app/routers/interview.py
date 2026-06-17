from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/interview", tags=["interview"])

class QuestionGenerationRequest(BaseModel):
    candidate_id: Optional[str] = None
    job_id: Optional[str] = None
    focus_areas: Optional[List[str]] = None

@router.post("/generate")
def generate_questions(payload: QuestionGenerationRequest, db: Session = Depends(get_db)):
    context = ""
    if payload.candidate_id:
        candidate = db.query(Candidate).filter(Candidate.id == payload.candidate_id).first()
        if candidate:
            context = f"Candidate Summary: {candidate.summary or ''}\nResume Details: {str(candidate.resume_content or '')}"
            
    if payload.job_id:
        job = db.query(Job).filter(Job.id == payload.job_id).first()
        if job:
            context += f"\nJob Role: {job.role or ''}\nJob Title: {job.title or ''}\nJob Skills: {','.join(job.skills or [])}"
            
    if gemini_service.model:
        prompt = f"""
        You are a senior tech recruiter. Generate 3 custom interview questions based on the context below:
        Context:
        {context}
        
        Focus areas: {','.join(payload.focus_areas) if payload.focus_areas else 'Any relevant technical/behavioral topics'}
        
        Return the response as a JSON array of strings containing the questions. Do not wrap in markdown.
        """
        try:
            import json
            response = gemini_service.model.generate_content(prompt)
            clean_text = response.text.strip()
            if clean_text.startswith("```"):
                lines = clean_text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                clean_text = "\n".join(lines).strip()
            questions = json.loads(clean_text)
            if isinstance(questions, list):
                return {"questions": questions}
        except Exception:
            pass
            
    # Fallback questions
    return {
        "questions": [
            "Explain the rendering optimizations you would implement for large datasets on a React dashboard.",
            "How do you design scalable state models using Zustand or Redux?",
            "Describe a challenging bug you fixed in a TypeScript application and how you approached it."
        ]
    }
