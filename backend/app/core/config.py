from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_anon_key: str = ""
    frontend_url: str = "http://localhost:3000"

    # Model settings
    chat_model: str = "gpt-4o"
    embedding_model: str = "text-embedding-3-small"

    # Paths
    data_dir: Path = Path(__file__).parent.parent / "data"
    models_dir: Path = Path(__file__).parent.parent.parent.parent / "StepUpAI" / "models"

settings = Settings()
