from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.database.session import Base

class MatchFactor(Base):
    __tablename__ = "match_factors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    name = Column(String, nullable=False)
    score_delta = Column(Integer, nullable=False)
    cumulative = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    
    candidate = relationship("Candidate", back_populates="match_factors")
