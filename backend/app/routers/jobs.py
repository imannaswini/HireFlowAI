import os
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.company import Company
from app.models.job import Job
from app.services.gemini_service import gemini_service
from app.core.file_parser import extract_text_from_file

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_job_description(
    company_name: Optional[str] = Form(None),
    job_title: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    experience_required: Optional[str] = Form(None),
    required_skills: Optional[str] = Form(None), # Comma separated list
    jd_description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Parses and stores a new Job Description.
    Supports file upload (PDF/DOCX/TXT) and pasted raw text description.
    """
    extracted_text = ""
    
    # 1. Extract text from uploaded document
    if file and file.filename:
        extracted_text = extract_text_from_file(file)
        
    # 2. Append pasted description details
    if jd_description:
        extracted_text += "\n" + jd_description
        
    extracted_text = extracted_text.strip()
    
    if not extracted_text:
        # If no file or pasted description, ensure we have explicit form fields
        if not (company_name and job_title):
            raise HTTPException(
                status_code=400, 
                detail="Provide a job description document, pasted text, or complete company and title form fields."
            )
            
    # 3. Analyze text with Gemini service (or fallback)
    ai_data = {}
    if extracted_text:
        ai_data = gemini_service.parse_job_description(extracted_text)
        
    # 4. Consolidate form inputs with AI extracted fields (form inputs override AI)
    final_company = company_name or ai_data.get("company") or "Unknown Enterprise"
    final_title = job_title or ai_data.get("title") or "Software Engineer"
    final_role = ai_data.get("role") or "Fullstack Specialist"
    final_dept = department or ai_data.get("dept") or "Engineering"
    final_location = ai_data.get("location") or "Remote"
    final_emp_type = ai_data.get("employment_type") or "Full-time"
    final_salary = ai_data.get("salary_range") or "Not Specified"
    final_exp = experience_required or ai_data.get("experience") or "Not Specified"
    
    # Parse skills
    final_skills = []
    if required_skills:
        final_skills = [s.strip() for s in required_skills.split(",") if s.strip()]
    elif ai_data.get("skills"):
        final_skills = ai_data.get("skills")
        
    final_soft_skills = ai_data.get("soft_skills") or []
    final_responsibilities = ai_data.get("responsibilities") or []
    final_seniority = ai_data.get("seniority") or ("Senior" if "senior" in final_title.lower() else "Mid-Level")

    # 5. Save Company and Job into database
    # Get or create company
    company = db.query(Company).filter(Company.name == final_company).first()
    if not company:
        company = Company(name=final_company)
        db.add(company)
        db.flush() # Populate company.id
        
    # Create Job listing
    new_job = Job(
        company_id=company.id,
        title=final_title,
        role=final_role,
        dept=final_dept,
        location=final_location,
        employment_type=final_emp_type,
        salary_range=final_salary,
        experience=final_exp,
        skills=final_skills,
        soft_skills=final_soft_skills,
        responsibilities=final_responsibilities,
        seniority=final_seniority,
        match_count=0,
        active_candidates=0,
        status="Active"
    )
    
    # Optionally save file reference
    if file and file.filename:
        # Create uploads/jobs folder if not exists
        upload_dir = "uploads/jobs"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, f"{new_job.id}_{file.filename}")
        # Reset file cursor for saving
        file.file.seek(0)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        new_job.jd_file_path = file_path
        
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    return {
        "message": "Job Description successfully analyzed and saved.",
        "job": {
            "id": new_job.id,
            "company_name": company.name,
            "title": new_job.title,
            "role": new_job.role,
            "dept": new_job.dept,
            "location": new_job.location,
            "employment_type": new_job.employment_type,
            "salary_range": new_job.salary_range,
            "experience": new_job.experience,
            "skills": new_job.skills,
            "soft_skills": new_job.soft_skills,
            "responsibilities": new_job.responsibilities,
            "seniority": new_job.seniority,
            "status": new_job.status
        }
    }

@router.get("")
def get_jobs(db: Session = Depends(get_db)):
    """
    Returns all jobs with company name joined.
    """
    jobs = db.query(Job).all()
    results = []
    for job in jobs:
        results.append({
            "id": job.id,
            "company_name": job.company.name,
            "title": job.title,
            "role": job.role,
            "dept": job.dept,
            "location": job.location,
            "employment_type": job.employment_type,
            "salary_range": job.salary_range,
            "experience": job.experience,
            "skills": job.skills,
            "soft_skills": job.soft_skills,
            "responsibilities": job.responsibilities,
            "seniority": job.seniority,
            "match_count": job.match_count,
            "active_candidates": job.active_candidates,
            "status": job.status
        })
    return results

@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    """
    Retrieve single job details.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job criteria not found.")
    return {
        "id": job.id,
        "company_name": job.company.name,
        "title": job.title,
        "role": job.role,
        "dept": job.dept,
        "location": job.location,
        "employment_type": job.employment_type,
        "salary_range": job.salary_range,
        "experience": job.experience,
        "skills": job.skills,
        "soft_skills": job.soft_skills,
        "responsibilities": job.responsibilities,
        "seniority": job.seniority,
        "match_count": job.match_count,
        "active_candidates": job.active_candidates,
        "status": job.status
    }
