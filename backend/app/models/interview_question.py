from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.database.session import Base

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    question_text = Column(String, nullable=False)
    category = Column(String, nullable=False) # Technical, Behavioral, Follow-up
    relevance_score = Column(String, nullable=True) # e.g. "98%"
    confidence_level = Column(String, nullable=True) # e.g. "Extreme", "Strong"
    target_focus = Column(String, nullable=True)
    
    candidate = relationship("Candidate", back_populates="interview_questions")
