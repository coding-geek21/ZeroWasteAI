"""Pydantic models for AI waste predictions."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class PredictionItem(BaseModel):
    """Single item prediction from the AI prediction agent."""

    item_id: str
    item_name: str
    risk_level: str = Field(..., pattern="^(HIGH|MEDIUM|LOW)$")
    waste_probability: float = Field(..., ge=0.0, le=1.0)
    hours_until_critical: int = Field(..., ge=0)
    estimated_demand_next_24h: float = Field(..., ge=0.0)
    surplus_quantity: float = Field(..., ge=0.0)
    financial_risk: float = Field(..., ge=0.0, description="Estimated financial loss in USD")
    priority_rank: int = Field(..., ge=1)
    reasoning: str


class PredictionSummary(BaseModel):
    """Aggregate summary of the current prediction run."""

    total_items_at_risk: int
    total_financial_risk: float
    top_action_needed: str


class PredictionsResponse(BaseModel):
    """Full predictions response returned by the /predictions endpoint."""

    predictions: List[PredictionItem]
    summary: PredictionSummary
    generated_at: Optional[str] = None
