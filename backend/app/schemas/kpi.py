from pydantic import BaseModel
from typing import List, Dict, Any

class KPIResponse(BaseModel):
    active_jobs: int
    total_candidates: int
    hidden_talent: int
    average_score: float
    compliance_score: float
    interview_loops: int
    candidate_distribution: List[Dict[str, Any]]
