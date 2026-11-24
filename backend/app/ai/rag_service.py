import re
import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import models

class RAGService:
    def __init__(self):
        pass

    def _tokenize(self, text: str) -> set:
        tokens = re.findall(r'\b[a-zA-Z0-9_\u0C00-\u0C7F]{3,}\b', text.lower())
        return set(tokens)

    def retrieve_context(self, db: Session, query: str, limit: int = 4) -> List[Dict[str, Any]]:
        """
        Retrieves relevant snippets from projects, schemes, meetings, announcements, and services.
        Uses a BM25/TF-IDF inspired keyword scoring algorithm that natively supports English and Telugu terms.
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        candidates = []

        # 1. Development Projects
        projects = db.query(models.DevelopmentProject).all()
        for p in projects:
            doc_text = f"{p.project_name} {p.project_name_te or ''} {p.description or ''} {p.category} {p.location_name} {p.status} {p.department} Budget: Rs. {p.budget_sanctioned:,.0f} Progress: {p.progress_pct}% Contractor: {p.contractor_name or 'N/A'}"
            candidates.append({
                "source_title": p.project_name,
                "type": "Development Project",
                "text": f"Project: {p.project_name} (Category: {p.category}, Ward {p.ward_number}). Status: {p.status} ({p.progress_pct}% done). Sanctioned Budget: Rs. {p.budget_sanctioned:,.0f}. Spent: Rs. {p.expenditure_actual:,.0f}. Department: {p.department}. Location: {p.location_name}. Details: {p.description}",
                "raw_text": doc_text,
                "link": f"/projects/{p.id}"
            })

        # 2. Government Schemes
        schemes = db.query(models.Scheme).all()
        for s in schemes:
            doc_text = f"{s.name} {s.name_te or ''} {s.category} {s.description} {s.target_beneficiaries} {s.eligibility_criteria_text} {s.benefits_text} {s.department}"
            candidates.append({
                "source_title": s.name,
                "type": "Government Scheme",
                "text": f"Scheme: {s.name} ({s.category}). Department: {s.department}. Beneficiaries: {s.target_beneficiaries}. Benefits: {s.benefits_text}. Eligibility: {s.eligibility_criteria_text}. How to apply: {s.application_steps_text}. Official portal: {s.official_url}",
                "raw_text": doc_text,
                "link": f"/schemes/{s.id}"
            })

        # 3. Announcements
        announcements = db.query(models.Announcement).filter(models.Announcement.is_active == True).all()
        for a in announcements:
            doc_text = f"{a.title} {a.title_te or ''} {a.content} {a.category} {a.priority} {a.target_ward}"
            candidates.append({
                "source_title": a.title,
                "type": "Village Announcement",
                "text": f"Announcement [{a.category}] ({a.publish_date}): {a.title}. {a.content}. Target Ward: {a.target_ward}. Priority: {a.priority}.",
                "raw_text": doc_text,
                "link": "/announcements"
            })

        # 4. Gram Sabha Meetings
        meetings = db.query(models.Meeting).all()
        for m in meetings:
            decisions_str = " ".join([d.decision_text for d in m.decisions])
            actions_str = " ".join([a.action_text for a in m.action_items])
            doc_text = f"{m.title} {m.title_te or ''} {m.agenda} {m.minutes_text or ''} {decisions_str} {actions_str}"
            candidates.append({
                "source_title": m.title,
                "type": "Gram Sabha Meeting",
                "text": f"Meeting: {m.title} on {m.meeting_date} at {m.location}. Agenda: {m.agenda}. Decisions: {decisions_str or 'None recorded'}. Minutes summary: {m.summary_en or m.minutes_text or 'Pending'}",
                "raw_text": doc_text,
                "link": "/gram-sabha"
            })

        # 5. Government Services
        services = db.query(models.GovernmentService).all()
        for s in services:
            doc_text = f"{s.name} {s.name_te or ''} {s.category} {s.services_offered} {s.address} {s.contact_phone}"
            candidates.append({
                "source_title": s.name,
                "type": "Village Service",
                "text": f"Service Office: {s.name} ({s.category}). Address: {s.address}. Phone: {s.contact_phone}. Hours: {s.opening_hours}. Services: {s.services_offered}",
                "raw_text": doc_text,
                "link": "/services"
            })

        # 6. Agriculture records
        agri = db.query(models.AgricultureRecord).all()
        for ag in agri:
            doc_text = f"{ag.crop_name} {ag.crop_name_te or ''} {ag.season} {ag.soil_type} {ag.advisory_text} {ag.pest_alerts or ''}"
            candidates.append({
                "source_title": f"Crop Advisory: {ag.crop_name}",
                "type": "Agriculture Advisory",
                "text": f"Crop: {ag.crop_name} ({ag.season}). Soil: {ag.soil_type}. Water: {ag.water_requirement}. Advisory: {ag.advisory_text}. Pest Alerts: {ag.pest_alerts}",
                "raw_text": doc_text,
                "link": "/farmers"
            })

        # Score candidates
        scored_candidates = []
        for cand in candidates:
            cand_tokens = self._tokenize(cand["raw_text"])
            overlap = query_tokens.intersection(cand_tokens)
            if overlap:
                score = len(overlap) / (math.log(len(cand_tokens) + 1) + 1.0)
                # Boost if exact title match
                if any(t in cand["source_title"].lower() for t in query_tokens):
                    score += 2.0
                scored_candidates.append((score, cand))

        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_candidates[:limit]]

rag_service = RAGService()
