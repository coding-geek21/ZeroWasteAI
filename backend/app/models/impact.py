"""Pydantic models for impact tracking and dashboard statistics."""
from __future__ import annotations

import uuid
from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ImpactPeriod(str, Enum):
    week = "week"
    month = "month"
    year = "year"


class ImpactMetrics(BaseModel):
    """Cumulative impact metrics for a given time period."""

    period: ImpactPeriod
    start_date: date
    end_date: date
    # Environmental
    co2_saved_kg: float = 0.0
    water_saved_liters: float = 0.0
    food_saved_kg: float = 0.0
    # Social
    meals_donated: int = 0
    donations_count: int = 0
    # Financial
    money_saved_usd: float = 0.0
    waste_cost_avoided_usd: float = 0.0
    # Operational
    items_discounted: int = 0
    recipes_generated: int = 0
    alerts_triggered: int = 0


class ImpactLog(BaseModel):
    """A single logged impact event (action completed)."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    action_type: str
    item_name: str
    quantity_kg: float
    co2_saved_kg: float
    money_saved_usd: float
    meals_equivalent: int
    logged_at: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None


class WeeklyTrendPoint(BaseModel):
    """A single data-point in the weekly trend chart."""

    day: str        # e.g. "Mon", "Tue"
    waste_kg: float
    saved_kg: float


class DashboardStats(BaseModel):
    """Aggregate stats displayed on the dashboard overview card."""

    inventory_count: int
    items_at_risk: int
    actions_pending: int
    today_savings_usd: float
    today_co2_saved_kg: float
    today_food_saved_kg: float
    weekly_trend: List[WeeklyTrendPoint]
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class ImpactReport(BaseModel):
    """Full impact report with metrics + log entries."""

    metrics: ImpactMetrics
    log_entries: List[ImpactLog]
    top_impact_actions: List[str]
