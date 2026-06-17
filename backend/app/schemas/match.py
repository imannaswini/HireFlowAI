from pydantic import BaseModel
from typing import List, Dict, Any

class CandidateMatchResponse(BaseModel):
    id: str
    name: str
    email: str | None = None
    phone: str | None = None
    score: int
    potentialScore: int | None = None
    experience: str | None = None
    badge: str | None = None
    shortlisted: bool
    resumeContent: Dict[str, Any] = {}
    metrics: List[Any] = []

class MatchReplayResponse(BaseModel):
    candidate_id: str
    job_id: str
    skill_score: float
    experience_score: float
    project_score: float
    potential_score: float
    total_score: float
    factors: List[Dict[str, Any]] = []
