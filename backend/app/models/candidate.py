from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.session import Base

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    score = Column(Integer, default=0)
    potential_score = Column(Integer, nullable=True)
    experience = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    summary = Column(String, nullable=True)
    resume_raw_text = Column(String, nullable=True)
    resume_file_path = Column(String, nullable=True)
    resume_content = Column(JSON, default=dict) # Structured {skills, experienceBlocks, education}
    metrics = Column(JSON, default=list) # Radarchart comparison metrics
    shortlisted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("Job", back_populates="candidates")
    match_factors = relationship("MatchFactor", back_populates="candidate", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="candidate", cascade="all, delete-orphan")
