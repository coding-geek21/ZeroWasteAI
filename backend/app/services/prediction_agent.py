"""Prediction Agent — uses Gemini Flash to predict food waste risk."""
from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any, Dict, List

from google.genai import types  # type: ignore

from app.services.gemini_client import PREDICTION_MODEL, get_gemini_client

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are a food waste prediction AI for a grocery / restaurant management system.
Given a JSON array of current inventory items, analyse each item and return a prediction report.

Return a JSON object with this exact structure:
{
  "predictions": [
    {
      "item_id": "string",
      "item_name": "string",
      "risk_level": "HIGH | MEDIUM | LOW",
      "waste_probability": <float 0.0-1.0>,
      "hours_until_critical": <integer — hours until the item should be actioned>,
      "estimated_demand_next_24h": <float — expected consumption quantity in 24 h>,
      "surplus_quantity": <float — quantity likely to go unsold/unused>,
      "financial_risk": <float — estimated financial loss in USD if wasted>,
      "priority_rank": <integer — 1 is most urgent>,
      "reasoning": "string — concise explanation of the risk assessment"
    }
  ],
  "summary": {
    "total_items_at_risk": <integer — count of HIGH + MEDIUM items>,
    "total_financial_risk": <float — sum of financial_risk for all at-risk items>,
    "top_action_needed": "string — single most important action to take right now"
  }
}

Rules:
1. Consider expiry_date, freshness_score, waste_risk, quantity, and category.
2. Items without expiry dates: estimate based on category shelf life norms.
3. HIGH risk: expires in ≤ 48 h OR freshness_score < 40.
4. MEDIUM risk: expires in 49-120 h OR freshness_score 40-69.
5. LOW risk: expires in > 120 h AND freshness_score ≥ 70.
6. Rank items by urgency (1 = most urgent).
7. financial_risk = cost_per_unit × surplus_quantity (use 2.0 USD/kg if no cost given).
8. Return ONLY valid JSON — no markdown, no extra text.
"""


class PredictionAgent:
    """Predicts waste risk for inventory items using Gemini Flash."""

    def __init__(self) -> None:
        self._client = get_gemini_client()

    async def predict(self, inventory_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Run waste-risk predictions over the provided inventory.

        Args:
            inventory_items: List of item dicts (from FirestoreService).

        Returns:
            Parsed prediction JSON dict.
        """
        if not inventory_items:
            return {
                "predictions": [],
                "summary": {
                    "total_items_at_risk": 0,
                    "total_financial_risk": 0.0,
                    "top_action_needed": "No active inventory items to analyse.",
                },
            }

        inventory_text = json.dumps(inventory_items, default=str, indent=2)
        prompt = f"Here is the current inventory:\n\n{inventory_text}\n\nProvide your waste-risk predictions."

        try:
            response = self._client.models.generate_content(
                model=PREDICTION_MODEL,
                contents=[
                    types.Content(
                        role="user",
                        parts=[types.Part(text=prompt)],
                    )
                ],
                config=types.GenerateContentConfig(
                    system_instruction=_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
            raw = response.text or "{}"
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.error("PredictionAgent JSON parse error: %s", exc)
            return self._fallback(inventory_items)
        except Exception as exc:
            logger.exception("PredictionAgent error: %s", exc)
            return self._fallback(inventory_items)

    def _fallback(self, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a basic rule-based fallback when the API is unavailable."""
        predictions = []
        now = datetime.utcnow()
        for rank, item in enumerate(items, start=1):
            expiry_str = item.get("expiry_date")
            hours_left = 999
            if expiry_str:
                try:
                    expiry_dt = datetime.fromisoformat(str(expiry_str).replace("Z", ""))
                    hours_left = max(0, int((expiry_dt - now).total_seconds() / 3600))
                except ValueError:
                    pass

            risk = "LOW"
            prob = 0.1
            if hours_left <= 48:
                risk, prob = "HIGH", 0.85
            elif hours_left <= 120:
                risk, prob = "MEDIUM", 0.50

            cost = item.get("cost_per_unit", 2.0) or 2.0
            qty = item.get("quantity", 1.0) or 1.0
            surplus = qty * 0.3 if risk == "LOW" else qty * 0.6 if risk == "MEDIUM" else qty * 0.9
            predictions.append(
                {
                    "item_id": item.get("id", ""),
                    "item_name": item.get("name", "Unknown"),
                    "risk_level": risk,
                    "waste_probability": prob,
                    "hours_until_critical": hours_left,
                    "estimated_demand_next_24h": qty * 0.2,
                    "surplus_quantity": round(surplus, 2),
                    "financial_risk": round(cost * surplus, 2),
                    "priority_rank": rank,
                    "reasoning": "Rule-based fallback (AI unavailable).",
                }
            )

        at_risk = [p for p in predictions if p["risk_level"] in ("HIGH", "MEDIUM")]
        return {
            "predictions": predictions,
            "summary": {
                "total_items_at_risk": len(at_risk),
                "total_financial_risk": round(sum(p["financial_risk"] for p in at_risk), 2),
                "top_action_needed": "Review HIGH-risk items immediately." if at_risk else "All items are low risk.",
            },
        }
