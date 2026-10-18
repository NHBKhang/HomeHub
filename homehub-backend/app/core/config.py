from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "HomeHub"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./homehub.db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
print(settings.APP_NAME)
print(settings.API_V1_PREFIX)
print(settings.DATABASE_URL)
