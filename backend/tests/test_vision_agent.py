import pytest
import base64
from unittest.mock import MagicMock, AsyncMock, patch


@pytest.mark.asyncio
async def test_analyze_image_returns_items():
    mock_response_text = '''
    {
      "items": [
        {
          "name": "Roma Tomatoes",
          "category": "produce",
          "quantity": 1.0,
          "unit": "kg",
          "freshness_score": 80,
          "estimated_days_left": 5,
          "storage_condition": "refrigerated",
          "visible_issues": null,
          "confidence": 0.95
        }
      ],
      "image_quality": "good",
      "storage_assessment": "Well organized fridge.",
      "total_items_detected": 1
    }
    '''

    with patch("app.services.vision_agent.get_gemini_client") as mock_client_fn:
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = mock_response_text
        mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        from app.services.vision_agent import VisionAgent
        agent = VisionAgent()

        # Create a tiny 1x1 white JPEG in base64
        import io
        from PIL import Image
        img = Image.new("RGB", (1, 1), color=(255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        img_b64 = base64.b64encode(buf.getvalue()).decode()

        result = await agent.analyze_image(img_b64)

        assert "items" in result
        assert len(result["items"]) == 1
        assert result["items"][0]["name"] == "Roma Tomatoes"
        assert result["total_items_detected"] == 1
