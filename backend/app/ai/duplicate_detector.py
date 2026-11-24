import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import models

def find_duplicate_issues(
    db: Session,
    title: str,
    description: str,
    category: str,
    ward_number: int,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    Detects potential duplicate civic complaints based on category, ward, text overlap, and geolocation.
    """
    def tokenize(text: str) -> set:
        return set(re.findall(r'\b[a-zA-Z0-9_\u0C00-\u0C7F]{3,}\b', text.lower()))

    input_tokens = tokenize(f"{title} {description}")

    # Query issues from same category or same ward
    candidate_issues = db.query(models.CivicIssue).filter(
        (models.CivicIssue.category == category) | (models.CivicIssue.ward_number == ward_number)
    ).filter(
        models.CivicIssue.status.in_(["Submitted", "Acknowledged", "Assigned", "In progress"])
    ).all()

    duplicates = []
    for issue in candidate_issues:
        issue_tokens = tokenize(f"{issue.title} {issue.description}")
        intersection = input_tokens.intersection(issue_tokens)
        
        # Calculate Jaccard similarity
        union = input_tokens.union(issue_tokens)
        sim_score = len(intersection) / len(union) if union else 0.0

        # Geo proximity check
        is_nearby = False
        dist_approx_m = None
        if latitude and longitude and issue.latitude and issue.longitude:
            # 1 deg lat ~ 111,000 meters
            dlat = (latitude - issue.latitude) * 111000
            dlon = (longitude - issue.longitude) * 111000 * 0.96 # approx for India ~16 deg N
            dist_approx_m = int((dlat**2 + dlon**2)**0.5)
            if dist_approx_m < 500:
                is_nearby = True
                sim_score += 0.25 # Boost score for proximity

        # Same ward boost
        if issue.ward_number == ward_number and issue.category == category:
            sim_score += 0.20

        if sim_score >= 0.35:
            duplicates.append({
                "id": issue.id,
                "title": issue.title,
                "category": issue.category,
                "ward_number": issue.ward_number,
                "location_name": issue.location_name,
                "status": issue.status,
                "created_at": issue.created_at.strftime("%Y-%m-%d"),
                "similarity_pct": min(int(sim_score * 100), 98),
                "distance_meters": dist_approx_m
            })

    duplicates.sort(key=lambda x: x["similarity_pct"], reverse=True)
    return duplicates[:3]
