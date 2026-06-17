from pydantic import BaseModel
from typing import List, Dict, Any

class JobAnalyticsResponse(BaseModel):
    job_id: str
    job_title: str
    total_candidates: int
    avg_score: float
    shortlisted_count: int
    skills_gap: List[Dict[str, Any]]  # Each dict contains 'subject', 'A', 'B'
    hiring_funnel_trend: List[Dict[str, Any]]
