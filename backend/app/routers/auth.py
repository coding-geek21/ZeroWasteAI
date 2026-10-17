"""Auth router — user profile management (stub endpoints)."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/auth", tags=["auth"])


class UserProfile(BaseModel):
    """User profile data."""

    uid: str
    email: str
    display_name: str
    photo_url: Optional[str] = None
    role: str = "manager"
    organisation: Optional[str] = None
    created_at: datetime
    last_sign_in: datetime
    preferences: Dict[str, Any] = Field(default_factory=dict)


class ProfileUpdateRequest(BaseModel):
    """Fields that can be updated in a user profile."""

    display_name: Optional[str] = None
    organisation: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


# Mock profile — in production this comes from Firebase Auth
_MOCK_PROFILE = UserProfile(
    uid="user-demo-001",
    email="demo@zerowaste.ai",
    display_name="Demo Manager",
    photo_url=None,
    role="manager",
    organisation="ZeroWaste Demo Store",
    created_at=datetime(2026, 1, 1, 9, 0, 0),
    last_sign_in=datetime.utcnow(),
    preferences={
        "notifications_enabled": True,
        "alert_threshold_hours": 48,
        "preferred_donation_bank": "fb-001",
        "currency": "USD",
    },
)


@router.get("/profile", response_model=UserProfile, summary="Get user profile")
async def get_profile() -> UserProfile:
    """Return the current user's profile.

    In production, validate the Firebase JWT from the Authorization header
    and fetch the real profile from Firestore.
    """
    return _MOCK_PROFILE


@router.put("/profile", response_model=UserProfile, summary="Update user profile")
async def update_profile(update: ProfileUpdateRequest) -> UserProfile:
    """Update mutable profile fields.

    In production, write changes back to Firestore after JWT validation.
    """
    if update.display_name:
        _MOCK_PROFILE.display_name = update.display_name
    if update.organisation:
        _MOCK_PROFILE.organisation = update.organisation
    if update.preferences:
        _MOCK_PROFILE.preferences.update(update.preferences)
    return _MOCK_PROFILE
