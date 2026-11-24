from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.database import get_db
from app.models import models
from app.schemas import schemas
from app.auth import security
from app.services.rule_engine import evaluate_scheme_eligibility

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[schemas.SchemeResponse])
def get_schemes(
    search: Optional[str] = None,
    category: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Scheme)
    
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.Scheme.name.ilike(search_fmt)) |
            (models.Scheme.name_te.ilike(search_fmt)) |
            (models.Scheme.description.ilike(search_fmt)) |
            (models.Scheme.target_beneficiaries.ilike(search_fmt)) |
            (models.Scheme.department.ilike(search_fmt))
        )

    if category and category != "All":
        query = query.filter(models.Scheme.category == category)

    if level and level != "All":
        query = query.filter(models.Scheme.government_level == level)

    return query.all()

@router.get("/{scheme_id}", response_model=schemas.SchemeResponse)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

@router.post("/recommend", response_model=List[schemas.SchemeRecommendationResult])
def recommend_schemes(
    profile: schemas.UserProfileSchema,
    db: Session = Depends(get_db)
):
    """
    Personalized Scheme Recommendation Engine:
    Evaluates citizen profile against all schemes using structured rules, keyword matching,
    and returns ranked recommendations with full explanations.
    """
    schemes = db.query(models.Scheme).all()
    results = []

    for s in schemes:
        status, score, breakdown, expl_en, expl_te = evaluate_scheme_eligibility(s.eligibility_rules, profile)

        # Separate matched, unmet, missing
        matched = [b["criterion"] + ": " + b["detail"] for b in breakdown if b["status"] == "Met"]
        unmet = [b["criterion"] + ": " + b["detail"] for b in breakdown if b["status"] == "Unmet"]
        missing = [b["criterion"] + ": " + b["detail"] for b in breakdown if b["status"] == "Unknown"]

        results.append({
            "scheme": schemas.SchemeResponse.from_orm(s),
            "match_status": status,
            "match_score": score,
            "matched_criteria": matched,
            "unmet_criteria": unmet,
            "missing_info": missing,
            "explanation": expl_en,
            "explanation_te": expl_te,
            "required_documents": s.required_documents or []
        })

    # Sort results by match score descending
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

@router.post("/eligibility", response_model=schemas.EligibilityEvaluationResponse)
def evaluate_specific_scheme(
    eval_req: schemas.EligibilityEvaluationRequest,
    db: Session = Depends(get_db)
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == eval_req.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    status, score, breakdown, expl_en, expl_te = evaluate_scheme_eligibility(scheme.eligibility_rules, eval_req.profile)

    return {
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "status": status,
        "score": score,
        "criteria_breakdown": breakdown,
        "explanation": expl_en,
        "required_documents": scheme.required_documents or []
    }

@router.post("/compare")
def compare_schemes(
    scheme_ids: List[int],
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Compares up to 4 schemes side-by-side.
    """
    if len(scheme_ids) > 4:
        scheme_ids = scheme_ids[:4]
    
    schemes = db.query(models.Scheme).filter(models.Scheme.id.in_(scheme_ids)).all()
    comparison_table = []

    for s in schemes:
        comparison_table.append({
            "id": s.id,
            "scheme_id": s.scheme_id,
            "name": s.name,
            "name_te": s.name_te,
            "category": s.category,
            "level": s.government_level,
            "department": s.department,
            "target_beneficiaries": s.target_beneficiaries,
            "benefits": s.benefits_text,
            "eligibility_summary": s.eligibility_criteria_text,
            "application_method": s.application_steps_text,
            "required_documents": s.required_documents or [],
            "official_url": s.official_url,
            "verification_status": s.verification_status
        })

    return comparison_table

# --- Document Readiness Checklist ---
@router.get("/{scheme_id}/checklist", response_model=List[schemas.DocumentChecklistResponse])
def get_scheme_checklist(
    scheme_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    checklists = db.query(models.CitizenDocumentChecklist).filter(
        models.CitizenDocumentChecklist.user_id == current_user.id,
        models.CitizenDocumentChecklist.scheme_id == scheme_id
    ).all()

    # If no checklist entries yet, initialize them from scheme.required_documents
    if not checklists and scheme.required_documents:
        for doc_name in scheme.required_documents:
            chk = models.CitizenDocumentChecklist(
                user_id=current_user.id,
                scheme_id=scheme_id,
                document_name=doc_name,
                document_type="Mandatory Requirement",
                status="Not collected"
            )
            db.add(chk)
        db.commit()
        checklists = db.query(models.CitizenDocumentChecklist).filter(
            models.CitizenDocumentChecklist.user_id == current_user.id,
            models.CitizenDocumentChecklist.scheme_id == scheme_id
        ).all()

    return checklists

@router.put("/checklist/{checklist_id}", response_model=schemas.DocumentChecklistResponse)
def update_checklist_item(
    checklist_id: int,
    update_in: schemas.DocumentChecklistUpdate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    chk = db.query(models.CitizenDocumentChecklist).filter(
        models.CitizenDocumentChecklist.id == checklist_id,
        models.CitizenDocumentChecklist.user_id == current_user.id
    ).first()
    if not chk:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    if update_in.status:
        chk.status = update_in.status
    if update_in.notes is not None:
        chk.notes = update_in.notes
    if update_in.file_url:
        chk.file_url = update_in.file_url

    db.commit()
    db.refresh(chk)
    return chk
