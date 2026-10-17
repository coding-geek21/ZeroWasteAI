"""Predictions router — AI waste-risk predictions for active inventory."""
from __future__ import annotations

import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.models.predictions import PredictionItem, PredictionSummary, PredictionsResponse
from app.services.firestore_service import get_firestore_service
from app.services.prediction_agent import PredictionAgent

router = APIRouter(prefix="/predictions", tags=["predictions"])
logger = logging.getLogger(__name__)


@router.get("", response_model=PredictionsResponse, summary="Get waste-risk predictions")
async def get_predictions() -> PredictionsResponse:
    """Run the AI prediction agent over active inventory items.

    Returns a prioritised list of predictions with risk levels, financial
    impact estimates, and an overall summary.
    """
    db = get_firestore_service()
    items = await db.get_inventory(status_filter="active")

    if not items:
        return PredictionsResponse(
            predictions=[],
            summary=PredictionSummary(
                total_items_at_risk=0,
                total_financial_risk=0.0,
                top_action_needed="No active inventory items found.",
            ),
            generated_at=datetime.utcnow().isoformat(),
        )

    agent = PredictionAgent()
    try:
        result = await agent.predict(items)
    except Exception as exc:
        logger.exception("Prediction agent error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    raw_predictions = result.get("predictions", [])
    raw_summary = result.get("summary", {})

    predictions = [PredictionItem(**p) for p in raw_predictions]
    summary = PredictionSummary(
        total_items_at_risk=raw_summary.get("total_items_at_risk", 0),
        total_financial_risk=raw_summary.get("total_financial_risk", 0.0),
        top_action_needed=raw_summary.get("top_action_needed", ""),
    )

    return PredictionsResponse(
        predictions=predictions,
        summary=summary,
        generated_at=datetime.utcnow().isoformat(),
    )
