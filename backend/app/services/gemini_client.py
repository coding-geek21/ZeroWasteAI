"""Singleton Gemini client factory and model name constants."""
from __future__ import annotations

import google.genai as genai  # type: ignore

from app.config import get_settings

# ── Model IDs ──────────────────────────────────────────────────────────────────
VISION_MODEL = "gemini-2.5-flash"
PREDICTION_MODEL = "gemini-2.5-flash"
ACTION_MODEL = "gemini-2.5-flash"
CHAT_MODEL = "gemini-2.5-flash"

# ── Singleton client ───────────────────────────────────────────────────────────
_client: genai.Client | None = None


def get_gemini_client() -> genai.Client:
    """Return (and lazily create) the shared Gemini client.

    Uses the GEMINI_API_KEY from application settings.
    """
    global _client
    if _client is None:
        settings = get_settings()
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client
