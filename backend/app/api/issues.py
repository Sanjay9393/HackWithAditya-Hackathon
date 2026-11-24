from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.database import get_db
from app.models import models
from app.schemas import schemas
from app.auth import security
from app.ai.duplicate_detector import find_duplicate_issues
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/issues", tags=["Civic Issues"])

@router.get("", response_model=List[schemas.CivicIssueResponse])
def get_issues(
    category: Optional[str] = None,
    status: Optional[str] = None,
    ward: Optional[int] = None,
    priority: Optional[str] = None,
    my_issues: Optional[bool] = False,
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(models.CivicIssue)

    if my_issues and current_user:
        query = query.filter(models.CivicIssue.user_id == current_user.id)

    if category and category != "All":
        query = query.filter(models.CivicIssue.category == category)

    if status and status != "All":
        query = query.filter(models.CivicIssue.status == status)

    if ward:
        query = query.filter(models.CivicIssue.ward_number == ward)

    if priority and priority != "All":
        query = query.filter(models.CivicIssue.priority == priority)

    return query.order_by(models.CivicIssue.created_at.desc()).all()

@router.get("/{issue_id}", response_model=schemas.CivicIssueResponse)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.CivicIssue).filter(models.CivicIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@router.post("", response_model=Dict[str, Any])
def report_issue(
    issue_in: schemas.CivicIssueCreate,
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
    db: Session = Depends(get_db)
):
    # Check for potential duplicates using AI duplicate detector
    potential_duplicates = find_duplicate_issues(
        db=db,
        title=issue_in.title,
        description=issue_in.description,
        category=issue_in.category,
        ward_number=issue_in.ward_number,
        latitude=issue_in.latitude,
        longitude=issue_in.longitude
    )

    # Automatically suggest classification and department
    classification = gemini_service.classify_civic_issue(issue_in.title, issue_in.description)
    suggested_dept = classification.get("suggested_department", "Panchayat Administration")
    priority = issue_in.priority or classification.get("suggested_priority", "Medium")

    issue = models.CivicIssue(
        village_id=issue_in.village_id,
        user_id=current_user.id if current_user and not issue_in.is_anonymous else None,
        title=issue_in.title,
        description=issue_in.description,
        category=issue_in.category,
        photo_url=issue_in.photo_url or "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
        location_name=issue_in.location_name,
        ward_number=issue_in.ward_number,
        latitude=issue_in.latitude or 16.3067,
        longitude=issue_in.longitude or 80.4365,
        priority=priority,
        is_anonymous=issue_in.is_anonymous,
        reporter_name=issue_in.reporter_name or (current_user.full_name if current_user else "Anonymous Resident"),
        reporter_phone=issue_in.reporter_phone or (current_user.phone if current_user else None),
        status="Submitted",
        assigned_department=suggested_dept
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)

    # Initial timeline update
    upd = models.IssueUpdate(
        issue_id=issue.id,
        status="Submitted",
        update_text=f"Complaint registered in Ward {issue.ward_number}. Auto-routed to {suggested_dept}.",
        updated_by="System Dispatcher"
    )
    db.add(upd)

    # Create notification for user if logged in
    if current_user:
        notif = models.Notification(
            user_id=current_user.id,
            title="Civic Complaint Registered",
            title_te="ఫిర్యాదు నమోదు చేయబడింది",
            message=f"Your complaint '{issue.title}' has been registered with ID #{issue.id}.",
            category="issue",
            link_url=f"/issues"
        )
        db.add(notif)

    db.commit()
    db.refresh(issue)

    return {
        "issue": schemas.CivicIssueResponse.from_orm(issue),
        "potential_duplicates": potential_duplicates,
        "duplicate_warning": f"Notice: Found {len(potential_duplicates)} similar reports in this area." if potential_duplicates else None
    }

@router.put("/{issue_id}", response_model=schemas.CivicIssueResponse)
def update_issue_status(
    issue_id: int,
    update_in: schemas.CivicIssueAdminUpdate,
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    issue = db.query(models.CivicIssue).filter(models.CivicIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    old_status = issue.status
    if update_in.status:
        issue.status = update_in.status
    if update_in.assigned_department:
        issue.assigned_department = update_in.assigned_department
    if update_in.assigned_officer:
        issue.assigned_officer = update_in.assigned_officer
    if update_in.priority:
        issue.priority = update_in.priority
    if update_in.resolution_notes:
        issue.resolution_notes = update_in.resolution_notes
        if update_in.status in ["Resolved", "Closed"]:
            import datetime
            issue.resolution_date = datetime.date.today().isoformat()

    # Create update timeline entry
    comment = update_in.update_comment or f"Status changed from '{old_status}' to '{issue.status}' by {admin_user.full_name}."
    upd = models.IssueUpdate(
        issue_id=issue.id,
        status=issue.status,
        update_text=comment,
        updated_by=admin_user.full_name
    )
    db.add(upd)

    # Notify reporter if they are a registered user
    if issue.user_id:
        notif = models.Notification(
            user_id=issue.user_id,
            title=f"Complaint #{issue.id} Updated: {issue.status}",
            title_te=f"ఫిర్యాదు #{issue.id} స్థితి నవీకరించబడింది: {issue.status}",
            message=f"Your complaint '{issue.title}' is now marked as {issue.status}. Note: {comment}",
            category="issue",
            link_url="/issues"
        )
        db.add(notif)

    db.commit()
    db.refresh(issue)
    return issue

@router.post("/{issue_id}/updates", response_model=schemas.CivicIssueResponse)
def add_issue_comment(
    issue_id: int,
    comment: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    issue = db.query(models.CivicIssue).filter(models.CivicIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    upd = models.IssueUpdate(
        issue_id=issue.id,
        status=issue.status,
        update_text=comment,
        updated_by=current_user.full_name
    )
    db.add(upd)
    db.commit()
    db.refresh(issue)
    return issue
