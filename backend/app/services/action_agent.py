"""Action Agent — uses Gemini 2.5 Pro to recommend waste-reduction actions."""
from __future__ import annotations

import json
import logging
import uuid
from typing import Any, Dict, List

from google.genai import types  # type: ignore

from app.services.gemini_client import ACTION_MODEL, get_gemini_client

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are a food waste reduction action planner AI.
Given predictions about at-risk inventory and the full inventory list, recommend specific actions
to minimise waste. Return a JSON object with this exact structure:

{
  "actions": [
    {
      "type": "DISCOUNT | RECIPE | DONATE | ALERT | COMPOST",
      "priority": "URGENT | HIGH | MEDIUM",
      "target_items": ["item_id_1", "item_id_2"],
      "title": "string — short, actionable title",
      "description": "string — 1-2 sentence description for staff",
      "details": {
        <type-specific fields below>
      },
      "estimated_savings": {
        "money_usd": <float>,
        "food_kg": <float>,
        "co2_kg": <float>,
        "meals_equivalent": <integer>
      }
    }
  ]
}

Action-type details schemas:
- DISCOUNT: {"suggested_discount_pct": int, "new_price": float, "valid_until": "ISO datetime string"}
- RECIPE: {"recipe_name": str, "ingredients": [str], "servings": int, "prep_time_min": int, "instructions": str}
- DONATE: {"food_bank_name": str, "contact": str, "pickup_time": str, "quantity_kg": float}
- ALERT: {"urgency_message": str, "action_deadline": "ISO datetime string"}
- COMPOST: {"compost_method": str, "co2_offset_kg": float}

Rules:
1. Generate between 3 and 8 diverse actions.
2. Prioritise URGENT for items expiring in < 24 h, HIGH for < 48 h, MEDIUM otherwise.
3. Always include at least one RECIPE action if produce/dairy/bakery items are at risk.
4. Include a DONATE action if quantity > 1 kg and items are still safe.
5. estimated_savings must be realistic — base on item cost_per_unit and quantity.
6. Return ONLY valid JSON — no markdown, no extra text.
"""


class ActionAgent:
    """Generates waste-reduction action recommendations using Gemini 2.5 Pro."""

    def __init__(self) -> None:
        self._client = get_gemini_client()

    async def generate_actions(
        self,
        predictions: List[Dict[str, Any]],
        inventory: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Generate action recommendations from predictions and inventory.

        Args:
            predictions: Output from PredictionAgent.predict().
            inventory: Full inventory list from FirestoreService.

        Returns:
            List of action dicts.
        """
        if not predictions:
            return self._default_actions()

        payload = json.dumps(
            {"predictions": predictions, "inventory": inventory},
            default=str,
            indent=2,
        )
        prompt = (
            "Based on the following predictions and inventory, generate waste-reduction actions:\n\n"
            f"{payload}"
        )

        try:
            response = self._client.models.generate_content(
                model=ACTION_MODEL,
                contents=[
                    types.Content(
                        role="user",
                        parts=[types.Part(text=prompt)],
                    )
                ],
                config=types.GenerateContentConfig(
                    system_instruction=_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.3,
                ),
            )
            raw = response.text or "{}"
            result = json.loads(raw)
            actions = result.get("actions", [])
            # Inject IDs and status
            for action in actions:
                action.setdefault("id", str(uuid.uuid4()))
                action.setdefault("status", "pending")
            return actions
        except json.JSONDecodeError as exc:
            logger.error("ActionAgent JSON parse error: %s", exc)
            return self._default_actions()
        except Exception as exc:
            logger.exception("ActionAgent error: %s", exc)
            return self._default_actions()

    def _default_actions(self) -> List[Dict[str, Any]]:
        """Return sensible default actions when AI is unavailable."""
        return [
            {
                "id": str(uuid.uuid4()),
                "type": "ALERT",
                "priority": "HIGH",
                "target_items": [],
                "title": "Review Expiring Items",
                "description": "Check your inventory for items expiring within 48 hours and take action.",
                "details": {
                    "urgency_message": "Some items may need immediate attention.",
                    "action_deadline": "",
                },
                "estimated_savings": {
                    "money_usd": 0.0,
                    "food_kg": 0.0,
                    "co2_kg": 0.0,
                    "meals_equivalent": 0,
                },
                "status": "pending",
            },
            {
                "id": str(uuid.uuid4()),
                "type": "RECIPE",
                "priority": "MEDIUM",
                "target_items": [],
                "title": "Use Seasonal Produce",
                "description": "Create a seasonal dish to use up fresh produce before it expires.",
                "details": {
                    "recipe_name": "Seasonal Vegetable Stir-Fry",
                    "ingredients": ["mixed vegetables", "garlic", "soy sauce", "oil"],
                    "servings": 4,
                    "prep_time_min": 20,
                    "instructions": "Sauté garlic, add vegetables, season with soy sauce. Serve over rice.",
                },
                "estimated_savings": {
                    "money_usd": 5.0,
                    "food_kg": 0.5,
                    "co2_kg": 1.0,
                    "meals_equivalent": 2,
                },
                "status": "pending",
            },
        ]
