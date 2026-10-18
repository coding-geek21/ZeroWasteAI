"""Firestore data access layer.

- If GOOGLE_APPLICATION_CREDENTIALS_JSON env var is set (a JSON string of the
  service-account key), real Cloud Firestore is used.
- Otherwise falls back to an in-memory dict store so local dev works without
  any credentials.
"""
from __future__ import annotations

import json
import logging
import math
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Firebase Admin SDK initialisation
# ---------------------------------------------------------------------------
_firebase_initialised = False
_db = None  # Firestore client, or None when using in-memory fallback


def _init_firebase() -> None:
    global _firebase_initialised, _db
    if _firebase_initialised:
        return

    creds_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON", "").strip()
    if not creds_json:
        logger.warning(
            "GOOGLE_APPLICATION_CREDENTIALS_JSON not set — "
            "falling back to in-memory store."
        )
        _firebase_initialised = True
        return

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        creds_dict = json.loads(creds_json)
        cred = credentials.Certificate(creds_dict)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)

        _db = firestore.client()
        logger.info("Connected to Cloud Firestore.")
    except Exception as exc:
        logger.error(
            "Failed to initialise Firestore: %s — using in-memory fallback.", exc
        )

    _firebase_initialised = True


# ---------------------------------------------------------------------------
# Sample seed data (in-memory fallback only)
# ---------------------------------------------------------------------------
_SAMPLE_INVENTORY: List[Dict[str, Any]] = [
    {
        "id": "item-001",
        "name": "Organic Strawberries",
        "category": "produce",
        "quantity": 2.5,
        "unit": "kg",
        "purchase_date": "2026-10-15T08:00:00",
        "expiry_date": "2026-10-21T08:00:00",
        "estimated_days_left": 3,
        "freshness_score": 55,
        "waste_risk": "HIGH",
        "cost_per_unit": 4.99,
        "image_url": None,
        "source": "manual",
        "status": "active",
        "created_at": "2026-10-15T08:00:00",
        "updated_at": "2026-10-15T08:00:00",
    },
    {
        "id": "item-002",
        "name": "Whole Milk",
        "category": "dairy",
        "quantity": 3.0,
        "unit": "liters",
        "purchase_date": "2026-10-14T10:00:00",
        "expiry_date": "2026-10-25T10:00:00",
        "estimated_days_left": 7,
        "freshness_score": 72,
        "waste_risk": "MEDIUM",
        "cost_per_unit": 1.89,
        "image_url": None,
        "source": "manual",
        "status": "active",
        "created_at": "2026-10-14T10:00:00",
        "updated_at": "2026-10-14T10:00:00",
    },
    {
        "id": "item-003",
        "name": "Sourdough Bread",
        "category": "bakery",
        "quantity": 1.0,
        "unit": "units",
        "purchase_date": "2026-10-16T07:00:00",
        "expiry_date": "2026-10-22T07:00:00",
        "estimated_days_left": 4,
        "freshness_score": 80,
        "waste_risk": "MEDIUM",
        "cost_per_unit": 5.50,
        "image_url": None,
        "source": "manual",
        "status": "active",
        "created_at": "2026-10-16T07:00:00",
        "updated_at": "2026-10-16T07:00:00",
    },
    {
        "id": "item-004",
        "name": "Chicken Breast",
        "category": "meat",
        "quantity": 1.5,
        "unit": "kg",
        "purchase_date": "2026-10-17T09:00:00",
        "expiry_date": "2026-10-20T09:00:00",
        "estimated_days_left": 2,
        "freshness_score": 90,
        "waste_risk": "HIGH",
        "cost_per_unit": 8.99,
        "image_url": None,
        "source": "manual",
        "status": "active",
        "created_at": "2026-10-17T09:00:00",
        "updated_at": "2026-10-17T09:00:00",
    },
    {
        "id": "item-005",
        "name": "Canned Black Beans",
        "category": "canned",
        "quantity": 6.0,
        "unit": "units",
        "purchase_date": "2026-09-01T00:00:00",
        "expiry_date": "2028-09-01T00:00:00",
        "estimated_days_left": 700,
        "freshness_score": 99,
        "waste_risk": "LOW",
        "cost_per_unit": 1.29,
        "image_url": None,
        "source": "manual",
        "status": "active",
        "created_at": "2026-09-01T00:00:00",
        "updated_at": "2026-09-01T00:00:00",
    },
]

_SAMPLE_FOOD_BANKS: List[Dict[str, Any]] = [
    {
        "id": "fb-001",
        "name": "City Harvest Food Bank",
        "address": "123 Main St, New York, NY 10001",
        "lat": 40.7128,
        "lng": -74.0060,
        "phone": "+1-212-555-0101",
        "email": "contact@cityharvest.example.com",
        "accepts": ["produce", "dairy", "bakery", "canned", "beverage"],
        "hours": "Mon-Sat 9am-5pm",
        "distance_km": None,
    },
    {
        "id": "fb-002",
        "name": "Community Food Pantry",
        "address": "456 Oak Ave, Brooklyn, NY 11201",
        "lat": 40.6892,
        "lng": -73.9442,
        "phone": "+1-718-555-0202",
        "email": "info@communitypantry.example.com",
        "accepts": ["produce", "bakery", "canned", "other"],
        "hours": "Tue-Sun 10am-6pm",
        "distance_km": None,
    },
    {
        "id": "fb-003",
        "name": "Fresh Start Food Network",
        "address": "789 Elm Blvd, Queens, NY 11375",
        "lat": 40.7282,
        "lng": -73.8448,
        "phone": "+1-917-555-0303",
        "email": "hello@freshstart.example.com",
        "accepts": ["produce", "dairy", "meat", "bakery", "frozen", "canned"],
        "hours": "Mon-Fri 8am-4pm",
        "distance_km": None,
    },
    {
        "id": "fb-004",
        "name": "Neighbors in Need",
        "address": "321 Pine Rd, Bronx, NY 10451",
        "lat": 40.8448,
        "lng": -73.8648,
        "phone": "+1-718-555-0404",
        "email": "donate@neighborsinneed.example.com",
        "accepts": ["produce", "canned", "beverage", "other"],
        "hours": "Wed-Sun 11am-7pm",
        "distance_km": None,
    },
    {
        "id": "fb-005",
        "name": "Staten Island Food Rescue",
        "address": "654 Maple Dr, Staten Island, NY 10301",
        "lat": 40.6301,
        "lng": -74.0939,
        "phone": "+1-718-555-0505",
        "email": "rescue@sifoodrescue.example.com",
        "accepts": ["produce", "dairy", "bakery", "canned", "frozen"],
        "hours": "Mon-Sat 9am-3pm",
        "distance_km": None,
    },
]

# In-memory fallback stores
_inventory_store: Dict[str, Dict[str, Any]] = {
    item["id"]: item for item in _SAMPLE_INVENTORY
}
_donations_store: Dict[str, Dict[str, Any]] = {}

INVENTORY_COLLECTION = "inventory"
DONATIONS_COLLECTION = "donations"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _doc_to_dict(doc) -> Dict[str, Any]:
    data = doc.to_dict() or {}
    data["id"] = doc.id
    return data


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.asin(math.sqrt(a))


# ---------------------------------------------------------------------------
# Service class
# ---------------------------------------------------------------------------

class FirestoreService:
    """Data access layer — real Firestore when credentials present, else in-memory."""

    def _use_firestore(self) -> bool:
        _init_firebase()
        return _db is not None

    # -- Inventory ------------------------------------------------------------

    async def get_inventory(
        self,
        status_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        risk_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        if self._use_firestore():
            try:
                query = _db.collection(INVENTORY_COLLECTION)
                if status_filter:
                    query = query.where("status", "==", status_filter)
                if category_filter:
                    query = query.where("category", "==", category_filter)
                if risk_filter:
                    query = query.where("waste_risk", "==", risk_filter)
                return [_doc_to_dict(d) for d in query.stream()]
            except Exception as exc:
                logger.error("Firestore get_inventory error: %s", exc)

        items = list(_inventory_store.values())
        if status_filter:
            items = [i for i in items if i.get("status") == status_filter]
        if category_filter:
            items = [i for i in items if i.get("category") == category_filter]
        if risk_filter:
            items = [i for i in items if i.get("waste_risk") == risk_filter]
        return items

    async def get_item(self, item_id: str) -> Optional[Dict[str, Any]]:
        if self._use_firestore():
            try:
                doc = _db.collection(INVENTORY_COLLECTION).document(item_id).get()
                return _doc_to_dict(doc) if doc.exists else None
            except Exception as exc:
                logger.error("Firestore get_item error: %s", exc)
        return _inventory_store.get(item_id)

    async def add_item(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow().isoformat()
        item_data.setdefault("id", str(uuid.uuid4()))
        item_data.setdefault("created_at", now)
        item_data["updated_at"] = now

        if self._use_firestore():
            try:
                _db.collection(INVENTORY_COLLECTION).document(item_data["id"]).set(item_data)
                return item_data
            except Exception as exc:
                logger.error("Firestore add_item error: %s — saving in memory.", exc)

        _inventory_store[item_data["id"]] = item_data
        return item_data

    async def update_item(
        self, item_id: str, updates: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        updates["updated_at"] = datetime.utcnow().isoformat()

        if self._use_firestore():
            try:
                ref = _db.collection(INVENTORY_COLLECTION).document(item_id)
                doc = ref.get()
                if not doc.exists:
                    return None
                ref.update(updates)
                return {**doc.to_dict(), **updates, "id": item_id}
            except Exception as exc:
                logger.error("Firestore update_item error: %s", exc)

        if item_id not in _inventory_store:
            return None
        _inventory_store[item_id].update(updates)
        return _inventory_store[item_id]

    async def delete_item(self, item_id: str) -> bool:
        if self._use_firestore():
            try:
                ref = _db.collection(INVENTORY_COLLECTION).document(item_id)
                if not ref.get().exists:
                    return False
                ref.delete()
                return True
            except Exception as exc:
                logger.error("Firestore delete_item error: %s", exc)

        if item_id in _inventory_store:
            del _inventory_store[item_id]
            return True
        return False

    # -- Food Banks -----------------------------------------------------------

    async def get_food_banks(
        self,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        radius_km: float = 50.0,
    ) -> List[Dict[str, Any]]:
        banks = list(_SAMPLE_FOOD_BANKS)
        if lat is not None and lng is not None:
            result = []
            for bank in banks:
                dist = _haversine(lat, lng, bank["lat"], bank["lng"])
                if dist <= radius_km:
                    b = dict(bank)
                    b["distance_km"] = round(dist, 2)
                    result.append(b)
            result.sort(key=lambda b: b["distance_km"])
            return result
        return banks

    # -- Donations ------------------------------------------------------------

    async def add_donation(self, donation_data: Dict[str, Any]) -> Dict[str, Any]:
        donation_data["id"] = str(uuid.uuid4())
        donation_data["created_at"] = datetime.utcnow().isoformat()

        if self._use_firestore():
            try:
                _db.collection(DONATIONS_COLLECTION).document(
                    donation_data["id"]
                ).set(donation_data)
                return donation_data
            except Exception as exc:
                logger.error("Firestore add_donation error: %s", exc)

        _donations_store[donation_data["id"]] = donation_data
        return donation_data

    async def get_donations(self) -> List[Dict[str, Any]]:
        if self._use_firestore():
            try:
                return [_doc_to_dict(d) for d in _db.collection(DONATIONS_COLLECTION).stream()]
            except Exception as exc:
                logger.error("Firestore get_donations error: %s", exc)
        return list(_donations_store.values())


# Module-level singleton
_firestore_service: Optional[FirestoreService] = None


def get_firestore_service() -> FirestoreService:
    global _firestore_service
    if _firestore_service is None:
        _firestore_service = FirestoreService()
    return _firestore_service
