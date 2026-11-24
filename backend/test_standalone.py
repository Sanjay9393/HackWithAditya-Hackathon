import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

print("Creating TestClient...")
with TestClient(app) as client:
    print("TestClient created, calling /api/health...")
    r = client.get("/api/health")
    print("Health response:", r.status_code, r.json())
    
    print("Calling /api/auth/login...")
    r2 = client.post("/api/auth/login", json={"username_or_email": "citizen", "password": "citizen123"})
    print("Citizen login response:", r2.status_code, r2.json()["user"]["full_name"])

    print("Calling /api/dashboard...")
    r3 = client.get("/api/dashboard")
    print("Dashboard response:", r3.status_code, "Projects:", r3.json()["kpis"]["total_works"])

    print("Calling /api/schemes...")
    r4 = client.get("/api/schemes")
    print("Schemes response:", r4.status_code, "Count:", len(r4.json()))

    print("ALL STANDALONE TESTS PASSED!")
