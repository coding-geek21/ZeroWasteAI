"""Food banks router — locate nearby food banks and record donations."""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from app.services.firestore_service import get_firestore_service

router = APIRouter(prefix="/food-banks", tags=["food-banks"])
logger = logging.getLogger(__name__)


class DonationRequest(BaseModel):
    """Request body for recording a donation."""

    food_bank_id: str
    item_ids: List[str] = Field(..., min_length=1)
    total_quantity_kg: float = Field(..., gt=0)
    notes: Optional[str] = None
    pickup_date: Optional[str] = None


@router.get("", summary="Find nearby food banks")
async def get_food_banks(
    lat: Optional[float] = Query(None, description="Latitude of origin"),
    lng: Optional[float] = Query(None, description="Longitude of origin"),
    radius_km: float = Query(50.0, description="Search radius in km (default 50)"),
) -> Dict[str, Any]:
    """Return food banks within a given radius.

    If lat/lng are not provided, all known food banks are returned.
    Results are sorted by distance when coordinates are given.
    """
    db = get_firestore_service()
    banks = await db.get_food_banks(lat=lat, lng=lng, radius_km=radius_km)
    return {"food_banks": banks, "total": len(banks)}


@router.post("/donations", status_code=201, summary="Record a donation")
async def create_donation(donation: DonationRequest) -> Dict[str, Any]:
    """Record a food donation to a food bank.

    Also marks the donated inventory items as 'donated'.
    """
    db = get_firestore_service()

    # Mark items as donated
    for item_id in donation.item_ids:
        await db.update_item(item_id, {"status": "donated"})

    donation_record = await db.add_donation(donation.model_dump())
    logger.info("Donation recorded: %s", donation_record.get("id"))
    return {"message": "Donation recorded successfully.", "donation": donation_record}
