"""Impact router — environmental and social impact tracking."""
from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Query

from app.models.impact import ImpactLog, ImpactMetrics, ImpactPeriod, ImpactReport
from app.services.firestore_service import get_firestore_service
from app.services.impact_calculator import calculate_co2_saved, calculate_meals_equivalent

router = APIRouter(prefix="/impact", tags=["impact"])

# Seeded log entries for demonstration
_SAMPLE_LOGS: List[ImpactLog] = [
    ImpactLog(
        id="log-001",
        action_type="DONATE",
        item_name="Organic Strawberries",
        quantity_kg=1.5,
        co2_saved_kg=calculate_co2_saved("produce", 1.5),
        money_saved_usd=7.49,
        meals_equivalent=calculate_meals_equivalent(1.5),
        logged_at=datetime.utcnow() - timedelta(days=1),
        notes="Donated to City Harvest Food Bank",
    ),
    ImpactLog(
        id="log-002",
        action_type="RECIPE",
        item_name="Sourdough Bread",
        quantity_kg=0.5,
        co2_saved_kg=calculate_co2_saved("bakery", 0.5),
        money_saved_usd=2.75,
        meals_equivalent=calculate_meals_equivalent(0.5),
        logged_at=datetime.utcnow() - timedelta(days=2),
        notes="Used in French toast recipe",
    ),
    ImpactLog(
        id="log-003",
        action_type="DISCOUNT",
        item_name="Whole Milk",
        quantity_kg=1.0,
        co2_saved_kg=calculate_co2_saved("dairy", 1.0),
        money_saved_usd=1.89,
        meals_equivalent=calculate_meals_equivalent(1.0),
        logged_at=datetime.utcnow() - timedelta(days=3),
        notes="30% markdown — sold before expiry",
    ),
]


def _period_range(period: ImpactPeriod) -> tuple[date, date]:
    today = date.today()
    if period == ImpactPeriod.week:
        return today - timedelta(weeks=1), today
    elif period == ImpactPeriod.month:
        return today - timedelta(days=30), today
    else:
        return today - timedelta(days=365), today


@router.get("", response_model=ImpactMetrics, summary="Get impact metrics")
async def get_impact(
    period: ImpactPeriod = Query(ImpactPeriod.week, description="Time period: week | month | year"),
) -> ImpactMetrics:
    """Return aggregated environmental and financial impact metrics."""
    start, end = _period_range(period)

    relevant_logs = [
        log for log in _SAMPLE_LOGS
        if start <= log.logged_at.date() <= end
    ]

    return ImpactMetrics(
        period=period,
        start_date=start,
        end_date=end,
        co2_saved_kg=round(sum(l.co2_saved_kg for l in relevant_logs), 3),
        food_saved_kg=round(sum(l.quantity_kg for l in relevant_logs), 3),
        money_saved_usd=round(sum(l.money_saved_usd for l in relevant_logs), 2),
        meals_donated=sum(l.meals_equivalent for l in relevant_logs if l.action_type == "DONATE"),
        donations_count=sum(1 for l in relevant_logs if l.action_type == "DONATE"),
        items_discounted=sum(1 for l in relevant_logs if l.action_type == "DISCOUNT"),
        recipes_generated=sum(1 for l in relevant_logs if l.action_type == "RECIPE"),
        waste_cost_avoided_usd=round(sum(l.money_saved_usd for l in relevant_logs), 2),
        water_saved_liters=round(sum(l.quantity_kg for l in relevant_logs) * 962, 1),
    )


@router.get("/report", response_model=ImpactReport, summary="Get full impact report")
async def get_impact_report(
    period: ImpactPeriod = Query(ImpactPeriod.month, description="Time period: week | month | year"),
) -> ImpactReport:
    """Return a comprehensive impact report with metrics and log entries."""
    metrics = await get_impact(period)
    top_actions = ["DONATE to local food banks", "Create RECIPES with at-risk produce",
                   "Apply DISCOUNTS before expiry"]
    return ImpactReport(
        metrics=metrics,
        log_entries=_SAMPLE_LOGS,
        top_impact_actions=top_actions,
    )
