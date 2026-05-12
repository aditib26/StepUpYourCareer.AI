import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from app.models.schemas import Mentor
from app.core.config import settings

_kmeans = None
_vectorizer = None
_mentors_df: pd.DataFrame | None = None


def _load_models() -> None:
    global _kmeans, _vectorizer, _mentors_df
    models_dir = settings.models_dir
    data_path = models_dir.parent / "mentors_final_data.json"

    if not models_dir.exists():
        return

    try:
        _kmeans = joblib.load(models_dir / "mentor_clustering_model.pkl")
        _vectorizer = joblib.load(models_dir / "fitted_vectorizer.pkl")
        _mentors_df = pd.read_json(str(data_path))
    except Exception:
        pass


_load_models()


def match_mentors(tech_gaps: list[str], top_n: int = 6) -> list[Mentor]:
    if _kmeans is None or _vectorizer is None or _mentors_df is None:
        return []

    skill_list = [s.strip() for s in tech_gaps if s.strip()]
    if not skill_list:
        return []

    try:
        vec = _vectorizer.transform([skill_list])
        cluster_id = _kmeans.predict(vec)[0]
        cluster_mentors = _mentors_df[_mentors_df["cluster"] == cluster_id]

        if cluster_mentors.empty:
            return []

        rows = cluster_mentors.head(top_n)
        result: list[Mentor] = []
        for _, row in rows.iterrows():
            linkedin_id = row.get("linkedin_id", "")
            linkedin_url = (
                linkedin_id
                if linkedin_id.startswith("http")
                else f"https://www.linkedin.com/in/{linkedin_id}"
            )
            result.append(
                Mentor(
                    mentor_id=str(row.get("mentor_id", "")),
                    name=row["name"],
                    bio=row["bio"],
                    linkedin_url=linkedin_url,
                    technical_skills=list(row["technical_skills"]),
                    role=row.get("role", ""),
                )
            )
        return result
    except Exception:
        return []
