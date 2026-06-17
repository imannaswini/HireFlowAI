from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    role: str
    dept: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    salary_range: Optional[str] = None
    experience: Optional[str] = None
    skills: List[str] = []
    soft_skills: List[str] = []
    responsibilities: List[str] = []
    seniority: Optional[str] = None

class JobCreate(JobBase):
    company_name: str

class JobResponse(JobBase):
    id: str
    company_id: str
    status: str
    match_count: int
    active_candidates: int
    candidate_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class AIDynamicAnalysis(BaseModel):
    title: str
    role: str
    dept: str
    company: str
    location: str
    employment_type: str
    skills: List[str]
    soft_skills: List[str]
    experience: str
    salary_range: str
    responsibilities: List[str]
