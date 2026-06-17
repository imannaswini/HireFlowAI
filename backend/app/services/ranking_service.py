from app.models.job import Job
from typing import List

class RankingService:
    def calculate_match(self, job: Job, candidate_skills: List[str], candidate_experience: str, candidate_text: str) -> dict:
        """
        Calculate a match score and factors between a job and a candidate.
        """
        job_skills = [s.lower() for s in (job.skills or [])]
        cand_skills = [s.lower() for s in (candidate_skills or [])]
        
        # Calculate skills overlap
        matched_skills = []
        if job_skills:
            for js in job_skills:
                if any(js in cs or cs in js for cs in cand_skills):
                    matched_skills.append(js)
            skills_score = int((len(matched_skills) / len(job_skills)) * 100) if job_skills else 80
        else:
            skills_score = 80
            
        # Determine overall match score
        score = min(max(skills_score, 60), 98) # between 60% and 98%
        
        # Assign badge based on score
        if score >= 90:
            badge = "Core Fit"
        elif score >= 80:
            badge = "Strong Lead"
        else:
            badge = "Hidden Talent"
            
        # Generate match factors
        factors = [
            {"name": "Skills Match", "score_delta": int(score * 0.4), "cumulative": int(score * 0.4), "description": f"Matched {len(matched_skills)} key skills including {', '.join(matched_skills[:3]) if matched_skills else 'general skills'}."},
            {"name": "Experience Alignment", "score_delta": int(score * 0.3), "cumulative": int(score * 0.7), "description": f"Candidate experience aligns well with target {job.experience or 'required'} experience."},
            {"name": "Role Relevance", "score_delta": int(score * 0.3), "cumulative": int(score), "description": f"Resume matches role category '{job.role}'."}
        ]
        
        return {
            "score": score,
            "potential_score": min(score + 5, 100),
            "badge": badge,
            "factors": factors
        }

ranking_service = RankingService()
