"""Vision Agent — uses Gemini 2.5 Pro to analyse food images."""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List

from google.genai import types  # type: ignore

from app.services.gemini_client import VISION_MODEL, get_gemini_client

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are an expert food vision AI for a waste-reduction platform.
Analyse the provided food image and return a JSON object with the following structure:

{
  "items": [
    {
      "name": "string — specific food name",
      "category": "produce | dairy | meat | bakery | frozen | canned | beverage | other",
      "quantity": <float — estimated quantity>,
      "unit": "kg | lbs | units | liters",
      "freshness_score": <integer 0-100 — 100 is perfectly fresh, 0 is completely spoiled>,
      "estimated_days_left": <integer — estimated days until the food is no longer safe/good>,
      "waste_risk": "HIGH | MEDIUM | LOW",
      "notes": "string — any relevant observations (mould, bruising, label info, etc.)"
    }
  ],
  "scene_description": "brief overall description of the image",
  "confidence": <float 0.0-1.0 — overall confidence in the analysis>
}

Rules:
1. Identify EVERY distinct food item visible in the image.
2. Estimate quantity as accurately as possible from visual cues.
3. Set waste_risk to HIGH if freshness_score < 40, MEDIUM if 40-69, LOW if 70+.
4. Read any visible labels, dates, or packaging text to improve accuracy.
5. Return ONLY valid JSON — no markdown, no extra text.
"""


class VisionAgent:
    """Analyses food images using Gemini Vision."""

    def __init__(self) -> None:
        self._client = get_gemini_client()

    async def analyze_image(self, image_base64: str) -> Dict[str, Any]:
        """Analyse a base64-encoded image and return structured food data.

        Args:
            image_base64: Base64-encoded image string (JPEG or PNG).

        Returns:
            Parsed JSON dict with ``items`` list and metadata.
        """
        try:
            response = self._client.models.generate_content(
                model=VISION_MODEL,
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part(
                                inline_data=types.Blob(
                                    mime_type="image/jpeg",
                                    data=image_base64,
                                )
                            ),
                            types.Part(text="Analyse this food image and return the JSON as instructed."),
                        ],
                    )
                ],
                config=types.GenerateContentConfig(
                    system_instruction=_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )
            raw = response.text or "{}"
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.error("VisionAgent JSON parse error: %s", exc)
            return {"items": [], "scene_description": "Parse error", "confidence": 0.0}
        except Exception as exc:
            logger.exception("VisionAgent error: %s", exc)
            return {"items": [], "scene_description": str(exc), "confidence": 0.0}

    def _fallback_response(self, reason: str) -> Dict[str, Any]:
        """Return a safe fallback when the API call fails."""
        return {
            "items": [],
            "scene_description": f"Analysis unavailable: {reason}",
            "confidence": 0.0,
        }
