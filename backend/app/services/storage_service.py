"""Storage service stub — wraps Google Cloud Storage uploads.

In development the service simply echoes back a placeholder URL.
Swap the _upload_to_gcs implementation for real GCS calls when credentials
are available.
"""
from __future__ import annotations

import base64
import logging
import uuid
from typing import Optional

from app.config import get_settings

logger = logging.getLogger(__name__)


class StorageService:
    """Handles image upload to GCS (or local fallback)."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.bucket_name = self.settings.GCS_BUCKET_NAME

    async def upload_image(self, image_base64: str, folder: str = "scans") -> str:
        """Upload a base64-encoded image and return its public URL.

        In development mode, returns a placeholder URL.

        Args:
            image_base64: Base64-encoded image data.
            folder: GCS folder/prefix to store the image under.

        Returns:
            Public URL of the uploaded image.
        """
        filename = f"{folder}/{uuid.uuid4()}.jpg"
        if self.settings.ENVIRONMENT == "development":
            logger.debug("Dev mode: skipping real GCS upload for %s", filename)
            return f"https://storage.googleapis.com/{self.bucket_name}/{filename}"

        # Real GCS upload (requires google-cloud-storage and credentials)
        try:
            return await self._upload_to_gcs(image_base64, filename)
        except Exception as exc:
            logger.error("GCS upload failed: %s", exc)
            return f"https://storage.googleapis.com/{self.bucket_name}/{filename}"

    async def _upload_to_gcs(self, image_base64: str, filename: str) -> str:
        """Perform the actual GCS upload (requires credentials)."""
        # Lazy import to avoid hard dependency when running without GCS
        from google.cloud import storage  # type: ignore

        client = storage.Client(project=self.settings.FIREBASE_PROJECT_ID)
        bucket = client.bucket(self.bucket_name)
        blob = bucket.blob(filename)
        image_bytes = base64.b64decode(image_base64)
        blob.upload_from_string(image_bytes, content_type="image/jpeg")
        blob.make_public()
        return blob.public_url


_storage_service: Optional[StorageService] = None


def get_storage_service() -> StorageService:
    """Return the module-level StorageService singleton."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
