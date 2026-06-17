import os
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.session import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.match_factor import MatchFactor
from app.models.interview_question import InterviewQuestion
from app.services.gemini_service import gemini_service
from app.services.ranking_service import ranking_service
from app.core.file_parser import extract_text_from_file

router = APIRouter(prefix="/api", tags=["candidates"])

class ShortlistRequest(BaseModel):
    shortlisted: bool

@router.post("/resumes/upload", status_code=status.HTTP_201_CREATED)
@router.post("/candidates/upload", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    job_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Uploads candidate resume, parses structured info using Gemini, and saves candidate details.
    """
    # Verify job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Target job description does not exist.")

    # 1. Extract raw text
    raw_text = extract_text_from_file(file)

    # 2. Parse structured profile via Gemini
    profile = gemini_service.parse_resume(raw_text)

    # 3. Create Candidate in Database
    candidate_id = str(uuid.uuid4())
    new_candidate = Candidate(
        id=candidate_id,
        job_id=job_id,
        name=profile.get("name") or "Candidate Name",
        email=profile.get("email"),
        phone=profile.get("phone"),
        experience=profile.get("experience") or "Not Specified",
        summary=profile.get("summary"),
        resume_raw_text=raw_text,
        resume_content=profile.get("resumeContent") or {},
        metrics=profile.get("metrics") or []
    )

    # Calculate match scores using ranking service
    match_result = ranking_service.calculate_match(
        job,
        new_candidate.resume_content.get("skills", []),
        new_candidate.experience,
        raw_text
    )
    new_candidate.score = match_result["score"]
    new_candidate.potential_score = match_result["potential_score"]
    new_candidate.badge = match_result["badge"]

    # Save uploaded file
    upload_dir = "uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{new_candidate.id}_{file.filename}")
    file.file.seek(0)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    new_candidate.resume_file_path = file_path

    db.add(new_candidate)
    db.flush() # Populate candidate.id

    # Create explainable match factors
    for df in match_result["factors"]:
        db.add(MatchFactor(
            candidate_id=new_candidate.id,
            name=df["name"],
            score_delta=df["score_delta"],
            cumulative=df["cumulative"],
            description=df["description"]
        ))

    # Add custom interview questions to Candidate
    for q in profile.get("questions") or []:
        db.add(InterviewQuestion(
            candidate_id=new_candidate.id,
            question_text=q,
            category="Technical" if "optimize" in q.lower() or "structure" in q.lower() else "Behavioral",
            relevance_score="95%",
            confidence_level="Strong",
            target_focus="Extracted focus area"
        ))

    # Increment active scan counts on Job
    job.active_candidates += 1
    job.match_count += 1

    db.commit()
    db.refresh(new_candidate)

    return {
        "message": "Candidate resume successfully parsed and indexed.",
        "candidate": {
            "id": new_candidate.id,
            "job_id": new_candidate.job_id,
            "name": new_candidate.name,
            "email": new_candidate.email,
            "phone": new_candidate.phone,
            "score": new_candidate.score,
            "potential_score": new_candidate.potential_score,
            "experience": new_candidate.experience,
            "badge": new_candidate.badge,
            "summary": new_candidate.summary,
            "resumeContent": new_candidate.resume_content,
            "metrics": new_candidate.metrics
        }
    }

@router.get("/jobs/{job_id}/candidates")
def get_job_candidates(job_id: str, db: Session = Depends(get_db)):
    """
    Returns ranked candidate list for a specific job.
    """
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).order_by(Candidate.score.desc()).all()
    results = []
    for cand in candidates:
        results.append({
            "id": cand.id,
            "name": cand.name,
            "email": cand.email,
            "phone": cand.phone,
            "score": cand.score,
            "potentialScore": cand.potential_score,
            "experience": cand.experience,
            "badge": cand.badge,
            "shortlisted": cand.shortlisted,
            "resumeContent": cand.resume_content,
            "metrics": cand.metrics
        })
    return results

@router.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    """
    Returns full candidate profile detail.
    """
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
        
    # Get associated interview questions
    questions = db.query(InterviewQuestion).filter(InterviewQuestion.candidate_id == candidate_id).all()
    q_list = [q.question_text for q in questions]
    if not q_list:
        # Fallback if no questions stored
        q_list = [
            "Tell us about a time you optimized performance inside deep React trees.",
            "Describe how you structure scalable TypeScript systems."
        ]

    # Get associated match factors
    factors = db.query(MatchFactor).filter(MatchFactor.candidate_id == candidate_id).all()
    factors_list = [{
        "name": f.name,
        "score_delta": f.score_delta,
        "cumulative": f.cumulative,
        "description": f.description
    } for f in factors]

    return {
        "id": cand.id,
        "job_id": cand.job_id,
        "name": cand.name,
        "email": cand.email,
        "phone": cand.phone,
        "score": cand.score,
        "potentialScore": cand.potential_score,
        "experience": cand.experience,
        "badge": cand.badge,
        "summary": cand.summary,
        "resumeContent": cand.resume_content,
        "metrics": cand.metrics,
        "questions": q_list,
        "factors": factors_list,
        "shortlisted": cand.shortlisted
    }

@router.post("/candidates/{candidate_id}/shortlist")
def toggle_candidate_shortlist(
    candidate_id: str,
    payload: ShortlistRequest,
    db: Session = Depends(get_db)
):
    """
    Toggles candidate shortlist state.
    """
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    cand.shortlisted = payload.shortlisted
    db.commit()
    return {
        "id": cand.id,
        "shortlisted": cand.shortlisted
    }
