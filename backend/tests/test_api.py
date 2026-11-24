import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.rule_engine import evaluate_scheme_eligibility
from app.schemas.schemas import UserProfileSchema

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "PrajaAI" in data["platform"]

def test_login_demo_users(client):
    # Test Citizen Login
    resp_citizen = client.post("/api/auth/login", json={
        "username_or_email": "citizen",
        "password": "citizen123"
    })
    assert resp_citizen.status_code == 200
    data_c = resp_citizen.json()
    assert "access_token" in data_c
    assert data_c["user"]["role"] == "citizen"

    # Test Admin Login
    resp_admin = client.post("/api/auth/login", json={
        "username_or_email": "admin",
        "password": "admin123"
    })
    assert resp_admin.status_code == 200
    data_a = resp_admin.json()
    assert "access_token" in data_a
    assert data_a["user"]["role"] == "admin"

def test_dashboard(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "village" in data
    assert "kpis" in data
    assert data["kpis"]["total_works"] >= 12
    assert data["kpis"]["total_issues"] >= 20

def test_projects_listing(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 12
    first = projects[0]
    assert "project_name" in first
    assert "budget_sanctioned" in first
    assert "progress_pct" in first

def test_schemes_listing(client):
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 15
    pm_kisan = next((s for s in schemes if s["scheme_id"] == "PM_KISAN"), None)
    assert pm_kisan is not None
    assert "eligibility_rules" in pm_kisan

def test_rule_engine_farmer_eligibility():
    farmer_profile = UserProfileSchema(
        age=45,
        state="Andhra Pradesh",
        occupation="farmer",
        is_farmer=True,
        annual_income=120000.0,
        land_holding_acres=3.5
    )
    pm_kisan_rules = {
        "occupation": ["farmer"],
        "is_farmer": True,
        "state": ["All India"],
        "max_land_acres": 25.0
    }
    status, score, breakdown, expl_en, expl_te = evaluate_scheme_eligibility(pm_kisan_rules, farmer_profile)
    assert status == "Potential match"
    assert score >= 80

def test_rule_engine_ineligible_criteria():
    student_profile = UserProfileSchema(
        age=20,
        state="Andhra Pradesh",
        occupation="student",
        is_farmer=False,
        is_student=True,
        annual_income=50000.0
    )
    farmer_rules = {
        "occupation": ["farmer"],
        "is_farmer": True
    }
    status, score, breakdown, expl_en, expl_te = evaluate_scheme_eligibility(farmer_rules, student_profile)
    assert "Likely not eligible" in status

def test_scheme_recommendation_endpoint(client):
    payload = {
        "age": 42,
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "village": "Chandanagar",
        "occupation": "farmer",
        "is_farmer": True,
        "is_student": False,
        "annual_income": 120000.0,
        "family_size": 4,
        "gender": "Male",
        "housing_status": "semi-pucca",
        "land_holding_acres": 3.5
    }
    response = client.post("/api/schemes/recommend", json=payload)
    assert response.status_code == 200
    recommendations = response.json()
    assert len(recommendations) >= 5
    assert recommendations[0]["match_score"] >= 80

def test_civic_issue_reporting_and_duplicate_detection(client):
    issue_payload = {
        "village_id": 1,
        "title": "Severe drinking water pipeline leak at Rythu Colony",
        "description": "Continuous freshwater overflow near community tap.",
        "category": "Water supply",
        "location_name": "Rythu Colony cross, Ward 3",
        "ward_number": 3,
        "priority": "High"
    }
    response = client.post("/api/issues", json=issue_payload)
    assert response.status_code == 200
    data = response.json()
    assert "issue" in data
    assert data["issue"]["category"] == "Water supply"
    assert "potential_duplicates" in data

def test_ai_chat_grounded(client):
    chat_payload = {
        "message": "What is the budget for road construction in Chandanagar?",
        "language": "en"
    }
    response = client.post("/api/ai/chat", json=chat_payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "citations" in data
    assert len(data["citations"]) > 0

def test_admin_permissions(client):
    login_res = client.post("/api/auth/login", json={"username_or_email": "citizen", "password": "citizen123"})
    token = login_res.json()["access_token"]
    
    del_res = client.delete("/api/projects/1", headers={"Authorization": f"Bearer {token}"})
    assert del_res.status_code == 403
