"""Scan router — accepts base64 images and returns AI vision analysis."""
from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.vision_agent import VisionAgent

router = APIRouter(prefix="/scan", tags=["scan"])
logger = logging.getLogger(__name__)


class ScanRequest(BaseModel):
    """Request body for the image scan endpoint."""

    image: str = Field(..., description="Base64-encoded JPEG or PNG image")


class ScanResponse(BaseModel):
    """Structured response from the vision agent."""

    items: list
    scene_description: str = ""
    confidence: float = 0.0
    raw: Dict[str, Any] = {}


@router.post("", response_model=ScanResponse, summary="Scan a food image")
async def scan_image(request: ScanRequest) -> ScanResponse:
    """Analyse a base64-encoded food image and return identified items.

    The vision agent uses Gemini 2.5 Pro to detect food items, estimate
    quantities, freshness scores, and waste risk.
    """
    if not request.image:
        raise HTTPException(status_code=400, detail="image field is required and must not be empty.")

    agent = VisionAgent()
    try:
        result = await agent.analyze_image(request.image)
    except Exception as exc:
        logger.exception("Scan endpoint error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Vision analysis failed: {exc}") from exc

    return ScanResponse(
        items=result.get("items", []),
        scene_description=result.get("scene_description", ""),
        confidence=result.get("confidence", 0.0),
        raw=result,
    )
