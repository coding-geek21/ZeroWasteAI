"""Inventory router — CRUD for food items."""
from __future__ import annotations

import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Response

from app.models.inventory import (
    FoodItem,
    FoodItemCreate,
    FoodItemUpdate,
    InventoryListResponse,
)
from app.services.firestore_service import get_firestore_service

router = APIRouter(prefix="/inventory", tags=["inventory"])
logger = logging.getLogger(__name__)


@router.get("", response_model=InventoryListResponse, summary="List inventory items")
async def get_inventory(
    risk: Optional[str] = Query(None, description="Filter by waste_risk: HIGH, MEDIUM, LOW"),
    category: Optional[str] = Query(None, description="Filter by food category"),
    status: Optional[str] = Query("active", description="Filter by status (default: active)"),
    sort: Optional[str] = Query(
        "expiry_date",
        description="Sort field: expiry_date | freshness_score | name | created_at",
    ),
) -> InventoryListResponse:
    """Return a filtered and sorted list of inventory items."""
    db = get_firestore_service()
    raw_items = await db.get_inventory(
        status_filter=status,
        category_filter=category,
        risk_filter=risk,
    )

    # Sorting
    sort_key = sort or "expiry_date"
    reverse = False
    if sort_key == "freshness_score":
        reverse = True  # highest first
    raw_items.sort(
        key=lambda x: (x.get(sort_key) is None, x.get(sort_key, "")),
        reverse=reverse,
    )

    items = [FoodItem(**item) for item in raw_items]
    return InventoryListResponse(items=items, total=len(items))


@router.post("", response_model=FoodItem, status_code=201, summary="Add a food item")
async def create_inventory_item(item_create: FoodItemCreate) -> FoodItem:
    """Add a new food item to inventory."""
    db = get_firestore_service()
    item_data = item_create.model_dump()
    for field in ("purchase_date", "expiry_date"):
        if item_data.get(field):
            item_data[field] = item_data[field].isoformat()

    saved = await db.add_item(item_data)
    return FoodItem(**saved)


@router.post("/bulk", response_model=List[FoodItem], status_code=201, summary="Bulk add food items")
async def bulk_create_inventory_items(payload: dict) -> List[FoodItem]:
    """Add multiple food items to inventory (supports { items: [...] } or direct list)."""
    db = get_firestore_service()
    items_raw = payload.get("items", []) if isinstance(payload, dict) else payload
    saved_items = []
    for raw in items_raw:
        item_obj = FoodItemCreate(**raw)
        data = item_obj.model_dump()
        for field in ("purchase_date", "expiry_date"):
            if data.get(field):
                data[field] = data[field].isoformat()
        saved = await db.add_item(data)
        saved_items.append(FoodItem(**saved))
    return saved_items


@router.put("/{item_id}", response_model=FoodItem, summary="Update a food item")
async def update_inventory_item(item_id: str, item_update: FoodItemUpdate) -> FoodItem:
    """Update an existing inventory item (partial update supported)."""
    db = get_firestore_service()
    updates = {k: v for k, v in item_update.model_dump().items() if v is not None}
    # Convert datetimes
    for field in ("purchase_date", "expiry_date"):
        if updates.get(field):
            updates[field] = updates[field].isoformat()

    updated = await db.update_item(item_id, updates)
    if updated is None:
        raise HTTPException(status_code=404, detail=f"Item '{item_id}' not found.")
    return FoodItem(**updated)


@router.delete("/{item_id}", status_code=204, response_class=Response, summary="Delete a food item")
async def delete_inventory_item(item_id: str) -> Response:
    """Permanently delete an inventory item."""
    db = get_firestore_service()
    deleted = await db.delete_item(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Item '{item_id}' not found.")
    return Response(status_code=204)
