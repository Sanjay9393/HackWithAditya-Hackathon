from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from app.database.database import get_db
from app.models import models
from app.auth import security

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/dashboard")
def get_admin_metrics(
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    total_users = db.query(models.User).count()
    total_projects = db.query(models.DevelopmentProject).count()
    total_issues = db.query(models.CivicIssue).count()
    pending_issues = db.query(models.CivicIssue).filter(models.CivicIssue.status.in_(["Submitted", "Acknowledged", "Assigned"])).count()
    resolved_issues = db.query(models.CivicIssue).filter(models.CivicIssue.status.in_(["Resolved", "Closed"])).count()
    total_announcements = db.query(models.Announcement).count()
    total_schemes = db.query(models.Scheme).count()
    total_meetings = db.query(models.Meeting).count()
    total_services = db.query(models.GovernmentService).count()

    recent_issues = db.query(models.CivicIssue).order_by(models.CivicIssue.created_at.desc()).limit(6).all()
    recent_projects = db.query(models.DevelopmentProject).order_by(models.DevelopmentProject.updated_at.desc()).limit(4).all()

    return {
        "metrics": {
            "total_users": total_users,
            "total_projects": total_projects,
            "total_issues": total_issues,
            "pending_issues": pending_issues,
            "resolved_issues": resolved_issues,
            "total_announcements": total_announcements,
            "total_schemes": total_schemes,
            "total_meetings": total_meetings,
            "total_services": total_services
        },
        "recent_issues": [
            {
                "id": i.id,
                "title": i.title,
                "category": i.category,
                "ward": i.ward_number,
                "priority": i.priority,
                "status": i.status,
                "reporter": i.reporter_name,
                "date": i.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for i in recent_issues
        ],
        "recent_projects": [
            {
                "id": p.id,
                "name": p.project_name,
                "category": p.category,
                "status": p.status,
                "progress_pct": p.progress_pct,
                "budget": p.budget_sanctioned
            }
            for p in recent_projects
        ],
        "admin_user": {
            "name": admin_user.full_name,
            "role": admin_user.role,
            "email": admin_user.email
        }
    }

@router.get("/activity")
def get_admin_audit_logs(
    admin_user: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    # Synthesized recent admin audit activity for prototype
    return [
        {"id": 1, "action": "Issue Status Updated", "target": "Complaint #1 - Water pipe rupture", "user": admin_user.full_name, "timestamp": "10 minutes ago", "status": "Success"},
        {"id": 2, "action": "Project Progress Recorded", "target": "CC Road Main Bazaar (78%)", "user": admin_user.full_name, "timestamp": "1 hour ago", "status": "Success"},
        {"id": 3, "action": "Announcement Published", "target": "Summer Drinking Water Timings", "user": admin_user.full_name, "timestamp": "3 hours ago", "status": "Success"},
        {"id": 4, "action": "Gram Sabha Agenda Synced", "target": "Q1 2026 General Body Meeting", "user": admin_user.full_name, "timestamp": "1 day ago", "status": "Success"},
        {"id": 5, "action": "Scheme Source Verified", "target": "Rythu Bharosa 2026 Guidelines", "user": admin_user.full_name, "timestamp": "2 days ago", "status": "Success"}
    ]
