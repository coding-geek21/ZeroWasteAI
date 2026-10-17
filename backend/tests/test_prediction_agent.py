import pytest
from unittest.mock import MagicMock, AsyncMock, patch


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
        "status": "active",
    }
]

MOCK_PREDICTION_RESPONSE = '''
{
  "predictions": [
    {
      "item_id": "item001",
      "item_name": "Fresh Salmon",
      "risk_level": "HIGH",
      "waste_probability": 0.85,
      "hours_until_critical": 12,
      "estimated_demand_next_24h": 1.0,
      "surplus_quantity": 1.5,
      "financial_risk": 27.0,
      "priority_rank": 1,
      "reasoning": "Salmon has a very short shelf life and freshness is dropping."
    }
  ],
  "summary": {
    "total_items_at_risk": 1,
    "total_financial_risk": 27.0,
    "top_action_needed": "Discount or donate salmon immediately."
  }
}
'''


@pytest.mark.asyncio
async def test_predict_returns_high_risk_for_expiring_item():
    with patch("app.services.prediction_agent.get_gemini_client") as mock_client_fn:
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = MOCK_PREDICTION_RESPONSE
        mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        from app.services.prediction_agent import PredictionAgent
        agent = PredictionAgent()
        result = await agent.predict(SAMPLE_INVENTORY)

        assert "predictions" in result
        assert result["predictions"][0]["risk_level"] == "HIGH"
        assert result["summary"]["total_items_at_risk"] == 1
