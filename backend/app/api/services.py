from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.database import get_db
from app.models import models
from app.schemas import schemas
from app.auth import security

router = APIRouter(prefix="/services", tags=["Government Services Directory"])

@router.get("", response_model=List[schemas.GovernmentServiceResponse])
def get_services(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.GovernmentService)
    if category and category != "All":
        query = query.filter(models.GovernmentService.category == category)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.GovernmentService.name.ilike(search_fmt)) |
            (models.GovernmentService.name_te.ilike(search_fmt)) |
            (models.GovernmentService.services_offered.ilike(search_fmt)) |
            (models.GovernmentService.address.ilike(search_fmt))
        )
    return query.all()

@router.get("/{service_id}", response_model=schemas.GovernmentServiceResponse)
def get_service_by_id(service_id: int, db: Session = Depends(get_db)):
    srv = db.query(models.GovernmentService).filter(models.GovernmentService.id == service_id).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Service listing not found")
    return srv

@router.post("", response_model=schemas.GovernmentServiceResponse)
def create_service(
    service_data: Dict[str, Any],
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    srv = models.GovernmentService(
        village_id=service_data.get("village_id", 1),
        name=service_data["name"],
        name_te=service_data.get("name_te"),
        category=service_data["category"],
        address=service_data["address"],
        contact_phone=service_data.get("contact_phone"),
        contact_email=service_data.get("contact_email"),
        opening_hours=service_data.get("opening_hours", "9:00 AM - 5:00 PM"),
        services_offered=service_data["services_offered"],
        latitude=service_data.get("latitude", 16.3067),
        longitude=service_data.get("longitude", 80.4365),
        official_link=service_data.get("official_link"),
        verification_status="Verified"
    )
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv

@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    srv = db.query(models.GovernmentService).filter(models.GovernmentService.id == service_id).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(srv)
    db.commit()
    return {"message": "Service deleted successfully", "id": service_id}
