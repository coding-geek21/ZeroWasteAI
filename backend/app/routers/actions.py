"""Actions router — recommended waste-reduction actions with lifecycle management."""
from __future__ import annotations

import logging
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.models.actions import ActionItem, ActionStatus, ActionsResponse, ChatRequest, ChatResponse
from app.services.action_agent import ActionAgent
from app.services.firestore_service import get_firestore_service
from app.services.gemini_client import CHAT_MODEL, get_gemini_client
from app.services.prediction_agent import PredictionAgent

router = APIRouter(prefix="/actions", tags=["actions"])
logger = logging.getLogger(__name__)

# In-memory actions store {id: dict}
_actions_store: Dict[str, dict] = {}


async def _refresh_actions() -> List[dict]:
    """(Re)generate actions from latest predictions and inventory."""
    db = get_firestore_service()
    items = await db.get_inventory(status_filter="active")
    pred_agent = PredictionAgent()
    pred_result = await pred_agent.predict(items)
    predictions = pred_result.get("predictions", [])

    action_agent = ActionAgent()
    actions = await action_agent.generate_actions(predictions, items)
    for action in actions:
        action.setdefault("id", str(uuid.uuid4()))
        action.setdefault("status", "pending")
        _actions_store[action["id"]] = action
    return actions


@router.get("", response_model=ActionsResponse, summary="List recommended actions")
async def get_actions(
    type: Optional[str] = Query(None, description="Filter by action type: DISCOUNT|RECIPE|DONATE|ALERT|COMPOST"),
    priority: Optional[str] = Query(None, description="Filter by priority: URGENT|HIGH|MEDIUM"),
    status: Optional[str] = Query("pending", description="Filter by status (default: pending)"),
) -> ActionsResponse:
    """Return pending waste-reduction action recommendations.

    If no actions exist in the store they are generated fresh from the
    current inventory and AI predictions.
    """
    pending = [a for a in _actions_store.values() if a.get("status") == (status or "pending")]
    if not pending:
        pending = await _refresh_actions()

    if type:
        pending = [a for a in pending if a.get("type") == type.upper()]
    if priority:
        pending = [a for a in pending if a.get("priority") == priority.upper()]

    actions = []
    for a in pending:
        try:
            actions.append(ActionItem(**a))
        except Exception:
            continue

    return ActionsResponse(actions=actions, total=len(actions))


def _set_action_status(action_id: str, new_status: str) -> ActionItem:
    """Update an action's status in the store and return the updated item."""
    if action_id not in _actions_store:
        raise HTTPException(status_code=404, detail=f"Action '{action_id}' not found.")
    _actions_store[action_id]["status"] = new_status
    if new_status == "completed":
        _actions_store[action_id]["completed_at"] = datetime.utcnow().isoformat()
    return ActionItem(**_actions_store[action_id])


@router.post("/{action_id}/accept", response_model=ActionItem, summary="Accept an action")
async def accept_action(action_id: str) -> ActionItem:
    """Mark an action as accepted (staff is working on it)."""
    return _set_action_status(action_id, "accepted")


@router.post("/{action_id}/complete", response_model=ActionItem, summary="Complete an action")
async def complete_action(action_id: str) -> ActionItem:
    """Mark an action as completed."""
    return _set_action_status(action_id, "completed")


@router.post("/{action_id}/dismiss", response_model=ActionItem, summary="Dismiss an action")
async def dismiss_action(action_id: str) -> ActionItem:
    """Dismiss an action (won't be shown again)."""
    return _set_action_status(action_id, "dismissed")


@router.post("/ask", response_model=ChatResponse, summary="Ask the AI assistant")
async def ask_assistant(request: ChatRequest) -> ChatResponse:
    """Ask the ZeroWaste AI assistant a natural-language question.

    The assistant has access to current inventory context and provides
    conversational advice on reducing food waste.
    """
    db = get_firestore_service()
    items = await db.get_inventory(status_filter="active")

    import json
    inventory_summary = json.dumps(
        [{"name": i.get("name"), "quantity": i.get("quantity"), "unit": i.get("unit"),
          "expiry_date": i.get("expiry_date"), "waste_risk": i.get("waste_risk")}
         for i in items[:10]],  # limit context size
        default=str,
    )

    system_prompt = (
        "You are ZeroWaste AI, a friendly and knowledgeable food waste reduction assistant. "
        "You help grocery managers and households reduce food waste, save money, and help the environment. "
        "You have access to the user's current inventory. Be concise, practical, and encouraging. "
        f"Current inventory summary:\n{inventory_summary}"
    )

    from google.genai import types  # type: ignore

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
        answer = response.text or "I'm sorry, I couldn't generate a response. Please try again."
    except Exception as exc:
        logger.exception("Chat assistant error: %s", exc)
        answer = (
            "I'm having trouble connecting to the AI service right now. "
            "Please check your API key and try again."
        )

    # Extract suggested actions from the response (simple heuristic)
    suggested = []
    keywords = {"discount": "DISCOUNT", "recipe": "RECIPE", "donate": "DONATE",
                "compost": "COMPOST", "alert": "ALERT"}
    for keyword, action_type in keywords.items():
        if keyword in answer.lower():
            suggested.append(action_type)

    return ChatResponse(answer=answer, suggested_actions=suggested)
