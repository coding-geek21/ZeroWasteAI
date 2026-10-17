"""Chat router — standalone conversational AI endpoint.

Note: The /actions/ask endpoint in actions.py also handles chat; this router
exposes a dedicated /chat prefix for direct access.
"""
from __future__ import annotations

import json
import logging

from fastapi import APIRouter

from app.models.actions import ChatRequest, ChatResponse
from app.services.firestore_service import get_firestore_service
from app.services.gemini_client import CHAT_MODEL, get_gemini_client

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse, summary="Chat with ZeroWaste AI")
async def chat(request: ChatRequest) -> ChatResponse:
    """Ask the ZeroWaste AI assistant anything about food waste reduction.

    The assistant has live context of the current inventory and provides
    actionable, conversational advice.
    """
    from google.genai import types  # type: ignore

    db = get_firestore_service()
    items = await db.get_inventory(status_filter="active")

    inventory_ctx = json.dumps(
        [
            {
                "name": i.get("name"),
                "category": i.get("category"),
                "quantity": i.get("quantity"),
                "unit": i.get("unit"),
                "expiry_date": i.get("expiry_date"),
                "waste_risk": i.get("waste_risk"),
                "freshness_score": i.get("freshness_score"),
            }
            for i in items[:15]
        ],
        default=str,
    )

    system_prompt = (
        "You are ZeroWaste AI — a warm, knowledgeable food waste reduction assistant. "
        "Your mission: help users save money, reduce waste, and benefit the environment. "
        "You know about food storage, recipes, donation logistics, composting, and sustainability. "
        "Be conversational, specific, and practical. Keep responses concise (under 200 words). "
        f"\n\nCurrent inventory:\n{inventory_ctx}"
    )

    client = get_gemini_client()
    try:
        response = client.models.generate_content(
            model=CHAT_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part(text=request.question)],
                )
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
            ),
        )
        answer = response.text or "I couldn't generate a response. Please try again."
    except Exception as exc:
        logger.exception("Chat router error: %s", exc)
        answer = (
            "I'm having trouble reaching the AI service right now. "
            "Please check your GEMINI_API_KEY and try again."
        )

    suggested = []
    for kw, action in [("discount", "DISCOUNT"), ("recipe", "RECIPE"),
                        ("donat", "DONATE"), ("compost", "COMPOST")]:
        if kw in answer.lower():
            suggested.append(action)

    return ChatResponse(answer=answer, suggested_actions=suggested)
