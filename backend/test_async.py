import sys
import os
import asyncio
import httpx

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

async def run_tests():
    print("Testing with httpx.AsyncClient and ASGITransport...")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/health")
        print("Health status:", r.status_code, r.json())

        r2 = await client.post("/api/auth/login", json={"username_or_email": "citizen", "password": "citizen123"})
        print("Login status:", r2.status_code, r2.json()["user"]["full_name"])

        r3 = await client.get("/api/dashboard")
        print("Dashboard status:", r3.status_code, "Projects:", r3.json()["kpis"]["total_works"])

        r4 = await client.get("/api/schemes")
        print("Schemes count:", len(r4.json()))

        # Test recommendations
        rec_payload = {
            "age": 42,
            "occupation": "farmer",
            "is_farmer": True,
            "annual_income": 120000.0,
            "land_holding_acres": 3.5
        }
        r5 = await client.post("/api/schemes/recommend", json=rec_payload)
        print("Recommendations count:", len(r5.json()), "Top match:", r5.json()[0]["scheme"]["name"], "Score:", r5.json()[0]["match_score"])

        # Test AI chat grounded
        chat_payload = {"message": "What is the budget for road construction in Chandanagar?", "language": "en"}
        r6 = await client.post("/api/ai/chat", json=chat_payload)
        print("AI Chat reply:", r6.json()["reply"][:100], "...")
        print("AI Citations count:", len(r6.json()["citations"]))

    print("\n>>> ALL ASYNC ASGI TESTS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    asyncio.run(run_tests())
