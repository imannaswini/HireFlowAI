from pydantic import BaseModel
from typing import List

class InterviewGenerateRequest(BaseModel):
    candidate_id: str | None = None
    job_id: str | None = None
    focus_areas: List[str] | None = None

class InterviewGenerateResponse(BaseModel):
    questions: List[str]
