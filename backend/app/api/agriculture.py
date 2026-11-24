from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/agriculture", tags=["Farmer Intelligence Center"])

@router.get("/advisories", response_model=List[schemas.AgricultureAdvisoryResponse])
def get_crop_advisories(
    season: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.AgricultureRecord)
    if season and season != "All":
        query = query.filter(models.AgricultureRecord.season == season)
    return query.all()

@router.get("/market", response_model=List[schemas.MarketPriceResponse])
def get_market_prices(db: Session = Depends(get_db)):
    return db.query(models.MarketPriceRecord).all()

@router.get("/weather-advisory")
def get_agricultural_weather():
    return {
        "station": "IMD Agro-Meteorological Advisory Station, Guntur",
        "date": "2026-02-23",
        "temperature_max": "32°C",
        "temperature_min": "20°C",
        "relative_humidity": "58%",
        "rainfall_forecast": "No significant rainfall expected over next 5 days. Dry weather conditions will prevail.",
        "farm_operations_advice": "Ideal conditions for drying harvested chili and Bengal gram. Farmers are advised to provide light irrigation to summer groundnut during evening hours to minimize evapotranspiration."
    }
