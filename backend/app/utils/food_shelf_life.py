"""Default shelf-life reference data (days from purchase) for common food items.

These values represent typical shelf life under proper storage conditions.
Use as a fallback when no expiry date is provided by the user or scanner.
"""

# Keyed by lowercase food name; value is (min_days, max_days) tuple
SHELF_LIFE_DAYS: dict[str, tuple[int, int]] = {
    # --- Produce ---
    "apple": (21, 35),
    "banana": (3, 7),
    "berries": (3, 7),
    "broccoli": (5, 10),
    "cabbage": (14, 21),
    "carrot": (21, 28),
    "cucumber": (7, 14),
    "garlic": (90, 180),
    "grapes": (5, 10),
    "lettuce": (5, 10),
    "mango": (5, 14),
    "mushroom": (5, 7),
    "onion": (30, 60),
    "orange": (14, 21),
    "pepper": (7, 14),
    "potato": (21, 60),
    "spinach": (3, 7),
    "strawberry": (3, 7),
    "tomato": (5, 10),
    "zucchini": (5, 10),
    # --- Dairy ---
    "butter": (14, 30),
    "cheese": (7, 21),
    "cream": (7, 14),
    "milk": (5, 10),
    "yogurt": (7, 14),
    # --- Meat ---
    "beef": (3, 5),
    "chicken": (2, 3),
    "fish": (1, 2),
    "lamb": (3, 5),
    "pork": (3, 5),
    "shrimp": (1, 2),
    "turkey": (2, 3),
    # --- Bakery ---
    "bagel": (2, 5),
    "bread": (3, 7),
    "cake": (3, 5),
    "croissant": (1, 3),
    "muffin": (3, 5),
    "pastry": (1, 3),
    # --- Frozen (months in freezer) ---
    "frozen chicken": (270, 365),
    "frozen beef": (120, 365),
    "frozen fish": (60, 180),
    "frozen vegetables": (240, 365),
    "frozen meals": (60, 120),
    "ice cream": (60, 90),
    # --- Canned / Pantry ---
    "canned beans": (730, 1825),
    "canned soup": (730, 1825),
    "canned tomatoes": (730, 1825),
    "canned tuna": (1095, 1825),
    "honey": (9999, 9999),   # Practically indefinite
    "pasta": (730, 1095),
    "rice": (730, 1825),
    # --- Beverages ---
    "juice": (7, 14),
    "soda": (90, 180),
    "water": (365, 730),
    "wine": (3, 5),           # Days after opening
    "beer": (60, 120),
}

# Category-level fallback defaults (days)
CATEGORY_SHELF_LIFE: dict[str, int] = {
    "produce": 7,
    "dairy": 10,
    "meat": 3,
    "bakery": 5,
    "frozen": 90,
    "canned": 730,
    "beverage": 30,
    "other": 14,
}


def get_shelf_life(food_name: str, category: str = "other") -> int:
    """Return the average shelf life in days for a given food item.

    Args:
        food_name: Lowercase name of the food item.
        category: Fallback category if the item is not in the lookup table.

    Returns:
        Estimated shelf life in days.
    """
    key = food_name.lower().strip()
    if key in SHELF_LIFE_DAYS:
        min_days, max_days = SHELF_LIFE_DAYS[key]
        return (min_days + max_days) // 2
    return CATEGORY_SHELF_LIFE.get(category, 14)
