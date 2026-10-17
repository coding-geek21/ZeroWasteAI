"""In-memory data store with Firestore-compatible API.

When Firebase credentials are available at runtime, swap the in-memory dict
for real Firestore calls. The public interface remains identical.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional


# ── Sample seed data ───────────────────────────────────────────────────────────
_SAMPLE_INVENTORY: List[Dict[str, Any]] = [
    {
        "id": "item-001",
        "name": "Organic Strawberries",
        "category": "produce",
        "quantity": 2.5,
        "unit": "kg",
        "purchase_date": "2026-10-15T08:00:00",
        "expiry_date": "2026-10-19T08:00:00",
        "estimated_days_left": 2,
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
        "expiry_date": "2026-10-21T10:00:00",
        "estimated_days_left": 4,
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
        "expiry_date": "2026-10-20T07:00:00",
        "estimated_days_left": 3,
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
        "expiry_date": "2026-10-19T09:00:00",
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

# In-memory stores (dict keyed by ID)
_inventory_store: Dict[str, Dict[str, Any]] = {
    item["id"]: item for item in _SAMPLE_INVENTORY
}
_donations_store: Dict[str, Dict[str, Any]] = {}


class FirestoreService:
    """Data access layer — in-memory now, Firestore-ready via simple swap."""

    # ── Inventory ─────────────────────────────────────────────────────────────

    async def get_inventory(
        self,
        status_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        risk_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Return all inventory items, with optional filters."""
        items = list(_inventory_store.values())
        if status_filter:
            items = [i for i in items if i.get("status") == status_filter]
        if category_filter:
            items = [i for i in items if i.get("category") == category_filter]
        if risk_filter:
            items = [i for i in items if i.get("waste_risk") == risk_filter]
        return items

    async def get_item(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Return a single item by ID, or None if not found."""
        return _inventory_store.get(item_id)

    async def add_item(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """Persist a new inventory item and return it with a generated ID."""
        if "id" not in item_data or not item_data["id"]:
            item_data["id"] = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        item_data.setdefault("created_at", now)
        item_data["updated_at"] = now
        _inventory_store[item_data["id"]] = item_data
        return item_data

    async def update_item(
        self, item_id: str, updates: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Apply partial updates to an existing item. Returns updated item or None."""
        if item_id not in _inventory_store:
            return None
        existing = _inventory_store[item_id]
        existing.update({k: v for k, v in updates.items() if v is not None})
        existing["updated_at"] = datetime.utcnow().isoformat()
        _inventory_store[item_id] = existing
        return existing

    async def delete_item(self, item_id: str) -> bool:
        """Delete an item. Returns True if deleted, False if not found."""
        if item_id in _inventory_store:
            del _inventory_store[item_id]
            return True
        return False

    # ── Food Banks ────────────────────────────────────────────────────────────

    async def get_food_banks(
        self,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        radius_km: float = 50.0,
    ) -> List[Dict[str, Any]]:
        """Return food banks, optionally filtered by radius from (lat, lng)."""
        banks = list(_SAMPLE_FOOD_BANKS)
        if lat is not None and lng is not None:
            import math

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

            result = []
            for bank in banks:
                dist = _haversine(lat, lng, bank["lat"], bank["lng"])
                if dist <= radius_km:
                    bank = dict(bank)
                    bank["distance_km"] = round(dist, 2)
                    result.append(bank)
            result.sort(key=lambda b: b["distance_km"])
            return result
        return banks

    # ── Donations ─────────────────────────────────────────────────────────────

    async def add_donation(self, donation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Record a donation and return it with a generated ID."""
        donation_data["id"] = str(uuid.uuid4())
        donation_data["created_at"] = datetime.utcnow().isoformat()
        _donations_store[donation_data["id"]] = donation_data
        return donation_data

    async def get_donations(self) -> List[Dict[str, Any]]:
        """Return all recorded donations."""
        return list(_donations_store.values())


# Module-level singleton
_firestore_service: Optional[FirestoreService] = None


def get_firestore_service() -> FirestoreService:
    """Return (lazily created) FirestoreService singleton."""
    global _firestore_service
    if _firestore_service is None:
        _firestore_service = FirestoreService()
    return _firestore_service
