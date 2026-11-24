from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from app.database.database import get_db
from app.models import models
from app.schemas import schemas
from app.auth import security

router = APIRouter(prefix="/projects", tags=["Development Projects"])

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    ward: Optional[int] = None,
    sort_by: Optional[str] = Query("updated_at", pattern="^(budget|progress|date|updated_at)$"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    query = db.query(models.DevelopmentProject)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.DevelopmentProject.project_name.ilike(search_fmt)) |
            (models.DevelopmentProject.description.ilike(search_fmt)) |
            (models.DevelopmentProject.location_name.ilike(search_fmt)) |
            (models.DevelopmentProject.department.ilike(search_fmt))
        )

    if category and category != "All":
        query = query.filter(models.DevelopmentProject.category == category)

    if status and status != "All":
        query = query.filter(models.DevelopmentProject.status == status)

    if ward:
        query = query.filter(models.DevelopmentProject.ward_number == ward)

    # Sorting
    order_func = desc if sort_order == "desc" else asc
    if sort_by == "budget":
        query = query.order_by(order_func(models.DevelopmentProject.budget_sanctioned))
    elif sort_by == "progress":
        query = query.order_by(order_func(models.DevelopmentProject.progress_pct))
    elif sort_by == "date":
        query = query.order_by(order_func(models.DevelopmentProject.start_date))
    else:
        query = query.order_by(order_func(models.DevelopmentProject.updated_at))

    return query.all()

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    proj = db.query(models.DevelopmentProject).filter(models.DevelopmentProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.post("", response_model=schemas.ProjectResponse)
def create_project(
    project_in: schemas.ProjectCreate,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    proj = models.DevelopmentProject(**project_in.dict())
    db.add(proj)
    db.commit()
    db.refresh(proj)

    # Initial update log
    upd = models.ProjectUpdate(
        project_id=proj.id,
        title="Project Sanctioned & Recorded",
        notes=f"Project sanctioned under department {proj.department}. Budget: Rs. {proj.budget_sanctioned:,.0f}.",
        progress_pct=proj.progress_pct,
        status=proj.status,
        updated_by=admin_user.full_name
    )
    db.add(upd)
    db.commit()
    db.refresh(proj)
    return proj

@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_in: schemas.ProjectUpdateInput,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    proj = db.query(models.DevelopmentProject).filter(models.DevelopmentProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    old_status = proj.status
    old_pct = proj.progress_pct

    for key, val in project_in.dict(exclude_unset=True).items():
        if val is not None:
            setattr(proj, key, val)

    # If progress or status changed, log an update
    if project_in.progress_pct is not None and project_in.progress_pct != old_pct:
        upd = models.ProjectUpdate(
            project_id=proj.id,
            title=f"Progress updated to {proj.progress_pct}%",
            notes=f"Status: {proj.status}. Updated by {admin_user.full_name}",
            progress_pct=proj.progress_pct,
            status=proj.status,
            updated_by=admin_user.full_name
        )
        db.add(upd)

    db.commit()
    db.refresh(proj)
    return proj

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    proj = db.query(models.DevelopmentProject).filter(models.DevelopmentProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"message": "Project deleted successfully", "id": project_id}

@router.post("/{project_id}/updates", response_model=schemas.ProjectResponse)
def add_project_update(
    project_id: int,
    update_in: schemas.ProjectUpdateSchema,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    proj = db.query(models.DevelopmentProject).filter(models.DevelopmentProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    proj.progress_pct = update_in.progress_pct
    proj.status = update_in.status

    upd = models.ProjectUpdate(
        project_id=proj.id,
        title=update_in.title,
        notes=update_in.notes,
        progress_pct=update_in.progress_pct,
        status=update_in.status,
        updated_by=admin_user.full_name
    )
    db.add(upd)
    db.commit()
    db.refresh(proj)
    return proj
