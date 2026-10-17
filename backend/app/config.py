"""Application configuration using Pydantic BaseSettings."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    GEMINI_API_KEY: str = "your_gemini_api_key_here"
    FIREBASE_PROJECT_ID: str = "your_firebase_project_id"
    GCS_BUCKET_NAME: str = "your_bucket_name"
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
