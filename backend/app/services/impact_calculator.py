"""Impact calculator helper functions."""
from __future__ import annotations

from app.utils.co2_factors import CO2_FACTORS, WATER_FACTORS

# Average calories in 1 kg of mixed food
_KCAL_PER_KG = 2_000
# One "meal" ≈ 600 kcal
_KCAL_PER_MEAL = 600


def calculate_co2_saved(category: str, kg: float) -> float:
    """Return CO2 equivalent (kg) saved by not wasting ``kg`` kg of ``category``.

    Args:
        category: Food category string (must match keys in CO2_FACTORS).
        kg: Mass of food saved in kilograms.

    Returns:
        CO2 saved in kg CO2e.
    """
    factor = CO2_FACTORS.get(category.lower(), CO2_FACTORS["other"])
    return round(factor * kg, 4)


def calculate_water_saved(category: str, kg: float) -> float:
    """Return water saved (litres) by not wasting ``kg`` kg of ``category``.

    Args:
        category: Food category string.
        kg: Mass of food saved in kilograms.

    Returns:
        Water saved in litres.
    """
    factor = WATER_FACTORS.get(category.lower(), WATER_FACTORS["other"])
    return round(factor * kg, 2)


def calculate_meals_equivalent(kg: float) -> int:
    """Return the number of meals equivalent to ``kg`` kg of food.

    Args:
        kg: Mass of food in kilograms.

    Returns:
        Equivalent number of meals (rounded to nearest integer).
    """
    total_kcal = kg * _KCAL_PER_KG
    return max(0, round(total_kcal / _KCAL_PER_MEAL))


def calculate_money_saved(cost_per_unit: float, quantity: float) -> float:
    """Return the money saved by preserving ``quantity`` units of food.

    Args:
        cost_per_unit: Cost per unit (USD).
        quantity: Number of units (or kg/lbs/liters).

    Returns:
        Total money saved in USD.
    """
    return round(max(0.0, cost_per_unit * quantity), 2)


def calculate_full_impact(
    category: str,
    kg: float,
    cost_per_unit: float = 0.0,
    quantity: float = 1.0,
) -> dict[str, float | int]:
    """Convenience wrapper that returns all impact metrics in one call.

    Returns:
        Dictionary with keys: co2_kg, water_liters, meals_equivalent, money_usd.
    """
    return {
        "co2_kg": calculate_co2_saved(category, kg),
        "water_liters": calculate_water_saved(category, kg),
        "meals_equivalent": calculate_meals_equivalent(kg),
        "money_usd": calculate_money_saved(cost_per_unit, quantity),
    }
