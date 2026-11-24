from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models import models
from app.schemas import schemas
from app.auth import security

router = APIRouter(prefix="/announcements", tags=["Announcements"])

@router.get("", response_model=List[schemas.AnnouncementResponse])
def get_announcements(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Announcement).filter(models.Announcement.is_active == True)

    if category and category != "All":
        query = query.filter(models.Announcement.category == category)
    if priority and priority != "All":
        query = query.filter(models.Announcement.priority == priority)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.Announcement.title.ilike(search_fmt)) |
            (models.Announcement.title_te.ilike(search_fmt)) |
            (models.Announcement.content.ilike(search_fmt))
        )

    return query.order_by(models.Announcement.created_at.desc()).all()

@router.post("", response_model=schemas.AnnouncementResponse)
def create_announcement(
    ann_in: schemas.AnnouncementCreate,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    ann = models.Announcement(**ann_in.dict())
    db.add(ann)
    db.commit()
    db.refresh(ann)

    # Broadcast notification to all users
    users = db.query(models.User).all()
    for u in users:
        n = models.Notification(
            user_id=u.id,
            title=f"New Announcement: {ann.title}",
            title_te=f"కొత్త గ్రామ ప్రకటన: {ann.title_te or ann.title}",
            message=ann.content[:150] + "...",
            category="announcement",
            link_url="/announcements"
        )
        db.add(n)
    db.commit()

    return ann

@router.put("/{announcement_id}", response_model=schemas.AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    ann_in: schemas.AnnouncementBase,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    ann = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    for key, val in ann_in.dict().items():
        setattr(ann, key, val)
    db.commit()
    db.refresh(ann)
    return ann

@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    ann = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(ann)
    db.commit()
    return {"message": "Announcement deleted successfully", "id": announcement_id}
