from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.interview_question import InterviewQuestion
from ..schemas.kpi import KPIResponse
from ..schemas.analytics import JobAnalyticsResponse

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/kpis", response_model=KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    """Return key performance indicators calculated from the database."""
    active_jobs = db.query(Job).count()
    
    candidates = db.query(Candidate).all()
    total_candidates = len(candidates)
    
    hidden_talent = sum(1 for c in candidates if c.badge == "Hidden Talent")
    
    avg_score = 0.0
    if total_candidates > 0:
        avg_score = round(sum(c.score or 0 for c in candidates) / total_candidates, 1)
        
    compliance_count = sum(1 for c in candidates if c.badge == "Compliance")
    compliance_score = round((compliance_count / total_candidates) * 100, 1) if total_candidates > 0 else 0.0
    
    interview_loops = db.query(InterviewQuestion).count()
    
    # Compute candidate distribution based on badges
    distribution_counts = {}
    for c in candidates:
        badge = c.badge or "Under Review"
        distribution_counts[badge] = distribution_counts.get(badge, 0) + 1
        
    candidate_distribution = []
    # Use distinct colors for common badges
    color_map = {
        "Core Fit": "#4F46E5",
        "Hidden Talent": "#06B6D4",
        "Under Review": "#8B5CF6",
        "Compliance": "#10B981"
    }
    
    if total_candidates > 0:
        for badge, count in distribution_counts.items():
            candidate_distribution.append({
                "name": badge,
                "value": round((count / total_candidates) * 100),
                "color": color_map.get(badge, "#9CA3AF")
            })
            
    return KPIResponse(
        active_jobs=active_jobs,
        total_candidates=total_candidates,
        hidden_talent=hidden_talent,
        average_score=avg_score,
        compliance_score=compliance_score,
        interview_loops=interview_loops,
        candidate_distribution=candidate_distribution
    )

@router.get("/jobs/{job_id}/analytics", response_model=JobAnalyticsResponse)
def get_job_analytics(job_id: str, db: Session = Depends(get_db)):
    """Return analytics for a specific job, including candidate counts and empty charts if no historical data exists."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")
        
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    total_candidates = len(candidates)
    
    avg_score = 0.0
    shortlisted_count = 0
    if total_candidates > 0:
        avg_score = round(sum(c.score or 0 for c in candidates) / total_candidates, 1)
        shortlisted_count = sum(1 for c in candidates if c.shortlisted)
        
    # Return actual historical analytics if available, otherwise return empty array
    # As there is no historical trend data model currently, we return an empty array
    hiring_funnel_trend = []
    
    # Return empty array for skills gap since we aren't generating fake data
    skills_gap = []
    
    return JobAnalyticsResponse(
        job_id=job_id,
        job_title=job.title,
        total_candidates=total_candidates,
        avg_score=avg_score,
        shortlisted_count=shortlisted_count,
        skills_gap=skills_gap,
        hiring_funnel_trend=hiring_funnel_trend
    )
