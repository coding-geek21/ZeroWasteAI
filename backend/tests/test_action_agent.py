import pytest
from unittest.mock import MagicMock, AsyncMock, patch


SAMPLE_PREDICTIONS = [
    {
        "item_id": "item001",
        "item_name": "Fresh Salmon",
        "risk_level": "HIGH",
        "waste_probability": 0.85,
        "hours_until_critical": 12,
        "financial_risk": 27.0,
        "priority_rank": 1,
        "reasoning": "Very close to expiry.",
    }
]

SAMPLE_INVENTORY = [
    {
        "id": "item001",
        "name": "Fresh Salmon",
        "category": "meat",
        "quantity": 2.5,
        "unit": "kg",
        "freshness_score": 55,
        "estimated_days_left": 1,
        "cost_per_unit": 18.0,
    }
]

MOCK_ACTION_RESPONSE = '''
{
  "actions": [
    {
      "type": "DISCOUNT",
      "priority": "URGENT",
      "target_items": ["item001"],
      "title": "30% Off Salmon Today",
      "description": "Apply a 30 percent discount to sell through salmon before it expires.",
      "details": {
        "suggested_discount_percent": 30,
        "original_price": 18.0,
        "new_price": 12.6,
        "expected_sell_through": 0.9
      },
      "estimated_savings": {
        "money_usd": 12.6,
        "food_kg": 2.5,
        "co2_kg": 67.5,
        "meals_equivalent": 10
      }
    }
  ],
  "total_potential_savings": {
    "money_usd": 12.6,
    "food_kg": 2.5,
    "co2_kg": 67.5
  }
}
'''


@pytest.mark.asyncio
async def test_recommend_generates_discount_action():
    with patch("app.services.action_agent.get_gemini_client") as mock_client_fn:
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = MOCK_ACTION_RESPONSE
        mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        from app.services.action_agent import ActionAgent
        agent = ActionAgent()
        result = await agent.recommend(SAMPLE_PREDICTIONS, SAMPLE_INVENTORY)

        assert "actions" in result
        assert result["actions"][0]["type"] == "DISCOUNT"
        assert result["actions"][0]["priority"] == "URGENT"
        assert result["total_potential_savings"]["food_kg"] == 2.5
