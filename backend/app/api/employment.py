from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/employment", tags=["Local Employment & MGNREGA"])

@router.get("", response_model=List[schemas.EmploymentResponse])
def get_employment_records(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.EmploymentRecord)
    if category and category != "All":
        query = query.filter(models.EmploymentRecord.category == category)
    return query.all()

@router.get("/mgnrega-guidance")
def get_mgnrega_guidance():
    return {
        "daily_wage_rate": "Rs. 300 / day (Andhra Pradesh notified rate FY 2025-26)",
        "guaranteed_days": "100 days per rural household",
        "steps_to_apply": [
            "Step 1: Obtain a Job Card application from the Village Secretariat (free of cost).",
            "Step 2: Submit family Aadhaar copies and passport photos to Field Assistant.",
            "Step 3: Job Card is issued within 15 days of application.",
            "Step 4: Submit Form 6 demanding work; receipt must be issued with dated acknowledgement.",
            "Step 5: Work is allocated within 5 km radius, or travel allowance is paid."
        ],
        "active_village_worksites": [
            {"name": "North Irrigation Canal Desilting (Reach 2)", "location": "Ward 3 Ayacut", "wage_seekers_enrolled": 48},
            {"name": "Community Farm Pond Excavation", "location": "Survey #142, Ward 4", "wage_seekers_enrolled": 32}
        ]
    }
