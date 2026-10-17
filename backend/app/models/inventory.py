"""Pydantic models for inventory items."""
from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class FoodCategory(str, Enum):
    produce = "produce"
    dairy = "dairy"
    meat = "meat"
    bakery = "bakery"
    frozen = "frozen"
    canned = "canned"
    beverage = "beverage"
    other = "other"


class FoodUnit(str, Enum):
    kg = "kg"
    lbs = "lbs"
    units = "units"
    liters = "liters"


class WasteRisk(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class FoodSource(str, Enum):
    camera_scan = "camera_scan"
    manual = "manual"
    pos_import = "pos_import"


class FoodStatus(str, Enum):
    active = "active"
    consumed = "consumed"
    discounted = "discounted"
    donated = "donated"
    wasted = "wasted"


class FoodItemCreate(BaseModel):
    """Fields required / accepted when creating a new food item."""

    name: str = Field(..., min_length=1, max_length=120)
    category: FoodCategory = FoodCategory.other
    quantity: float = Field(..., gt=0)
    unit: FoodUnit = FoodUnit.units
    purchase_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    cost_per_unit: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None
    source: FoodSource = FoodSource.manual


class FoodItemUpdate(BaseModel):
    """All fields optional — used for PATCH/PUT updates."""

    name: Optional[str] = Field(None, min_length=1, max_length=120)
    category: Optional[FoodCategory] = None
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[FoodUnit] = None
    purchase_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    estimated_days_left: Optional[int] = None
    freshness_score: Optional[int] = Field(None, ge=0, le=100)
    waste_risk: Optional[WasteRisk] = None
    cost_per_unit: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None
    source: Optional[FoodSource] = None
    status: Optional[FoodStatus] = None


class FoodItem(BaseModel):
    """Full food item representation stored in the database."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: FoodCategory = FoodCategory.other
    quantity: float
    unit: FoodUnit = FoodUnit.units
    purchase_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    estimated_days_left: Optional[int] = None
    freshness_score: Optional[int] = Field(None, ge=0, le=100)
    waste_risk: Optional[WasteRisk] = None
    cost_per_unit: Optional[float] = None
    image_url: Optional[str] = None
    source: FoodSource = FoodSource.manual
    status: FoodStatus = FoodStatus.active
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class InventoryListResponse(BaseModel):
    """Paginated / filtered inventory list."""

    items: List[FoodItem]
    total: int
