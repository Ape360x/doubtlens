from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str = ""
    openai_api_key: str = ""
    llm_provider: str = "auto"
    gemini_model: str = "gemini-2.0-flash"
    openai_model: str = "gpt-4o-mini"
    app_host: str = "127.0.0.1"
    app_port: int = 8000


settings = Settings()
