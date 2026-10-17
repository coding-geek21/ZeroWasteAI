"""CO2 emission factors (kg CO2e per kg of food) by category.

Sources: WRAP, FAO, OurWorldInData food carbon footprint datasets.
"""

CO2_FACTORS: dict[str, float] = {
    "meat": 27.0,       # Beef/lamb average — highest footprint
    "dairy": 3.2,       # Milk, cheese, yoghurt average
    "produce": 2.0,     # Fruit & vegetables average
    "bakery": 1.4,      # Bread, pastries, grains
    "frozen": 2.5,      # Frozen meals / frozen veg (includes processing energy)
    "canned": 1.0,      # Canned goods (lower due to long shelf life)
    "beverage": 0.8,    # Non-alcoholic drinks average
    "other": 2.0,       # Catch-all / mixed category
}

# Water footprint (litres per kg) by category, for informational use
WATER_FACTORS: dict[str, float] = {
    "meat": 15_400.0,
    "dairy": 1_020.0,
    "produce": 962.0,
    "bakery": 1_608.0,
    "frozen": 2_000.0,
    "canned": 800.0,
    "beverage": 300.0,
    "other": 1_000.0,
}
