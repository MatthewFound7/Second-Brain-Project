from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Load typed settings from environment."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str
    cors_allow_origins: list[str] = ["http://localhost:3000"]
    secret_key: str
    access_token_expire_minutes: int = 60 * 24 * 7
    auth_cookie_name: str = "session_token"


@lru_cache
def get_settings() -> Settings:

    return Settings()
