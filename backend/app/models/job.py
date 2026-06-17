from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database.session import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    role = Column(String, nullable=False)
    dept = Column(String, nullable=False)
    location = Column(String, nullable=True)
    employment_type = Column(String, nullable=True)
    salary_range = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    responsibilities = Column(JSON, default=list)
    seniority = Column(String, nullable=True)
    jd_file_path = Column(String, nullable=True)
    match_count = Column(Integer, default=0)
    active_candidates = Column(Integer, default=0)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="jobs")
    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")
