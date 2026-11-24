from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.database.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database

# Import routers
from app.api import (
    auth,
    dashboard,
    projects,
    budgets,
    issues,
    schemes,
    announcements,
    meetings,
    services,
    agriculture,
    employment,
    notifications,
    ai,
    admin
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PrajaAI")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing PrajaAI database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Smart Village AI Platform connecting citizens with village development, government schemes, civic reporting, and multilingual assistance in Telugu and English.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(budgets.router, prefix=settings.API_V1_STR)
app.include_router(issues.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(announcements.router, prefix=settings.API_V1_STR)
app.include_router(meetings.router, prefix=settings.API_V1_STR)
app.include_router(services.router, prefix=settings.API_V1_STR)
app.include_router(agriculture.router, prefix=settings.API_V1_STR)
app.include_router(employment.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "PrajaAI Smart Village Platform",
        "village": "Chandanagar Gram Panchayat",
        "version": "1.0.0",
        "state": "operational"
    }
