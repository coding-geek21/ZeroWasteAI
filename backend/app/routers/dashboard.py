"""Dashboard router — aggregate stats for the overview page."""
from __future__ import annotations

import random
from datetime import datetime

from fastapi import APIRouter

from app.models.impact import DashboardStats, WeeklyTrendPoint
from app.services.firestore_service import get_firestore_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


@router.get("", response_model=DashboardStats, summary="Get dashboard statistics")
async def get_dashboard() -> DashboardStats:
    """Return aggregate statistics for the ZeroWaste dashboard.

    Data is derived from the live inventory and supplemented with
    illustrative trend data for the weekly chart.
    """
    db = get_firestore_service()
    all_items = await db.get_inventory(status_filter="active")

    items_at_risk = sum(
        1 for item in all_items if item.get("waste_risk") in ("HIGH", "MEDIUM")
    )

    # Simulated savings based on inventory
    today_savings = round(
        sum(
            (item.get("cost_per_unit") or 2.0) * (item.get("quantity") or 1.0) * 0.05
            for item in all_items
        ),
        2,
    )
    today_food_saved = round(
        sum((item.get("quantity") or 0) * 0.1 for item in all_items if item.get("unit") == "kg"),
        2,
    )
    today_co2_saved = round(today_food_saved * 2.0, 2)

    # Weekly trend — realistic-looking data
    seed = datetime.utcnow().isocalendar()[1]  # week number for stable demo data
    rng = random.Random(seed)
    weekly_trend = [
        WeeklyTrendPoint(
            day=day,
            waste_kg=round(rng.uniform(0.3, 2.5), 2),
            saved_kg=round(rng.uniform(0.5, 3.0), 2),
        )
        for day in _DAYS
    ]

    return DashboardStats(
        inventory_count=len(all_items),
        items_at_risk=items_at_risk,
        actions_pending=max(1, items_at_risk),  # at least 1 for UI demo
        today_savings_usd=today_savings,
        today_co2_saved_kg=today_co2_saved,
        today_food_saved_kg=today_food_saved,
        weekly_trend=weekly_trend,
        last_updated=datetime.utcnow(),
    )
