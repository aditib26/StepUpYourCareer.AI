import json
from pathlib import Path
from app.models.schemas import Resource, SkillResources
from app.core.config import settings

_resources: dict[str, list[dict]] = {}


def _load() -> None:
    global _resources
    path = settings.data_dir / "resources.json"
    if path.exists():
        with open(path) as f:
            raw: list[dict] = json.load(f)
        for entry in raw:
            key = entry["skill_slug"].upper()
            _resources.setdefault(key, []).append(entry)


_load()


def _normalize(skill: str) -> str:
    return skill.strip().upper()


def get_resources_for_skill(skill: str) -> list[Resource]:
    key = _normalize(skill)
    entries = _resources.get(key, [])

    # Fuzzy fallback: check if any loaded key contains the skill token
    if not entries:
        for k, v in _resources.items():
            if key in k or k in key:
                entries = v
                break

    return [
        Resource(
            title=e["title"],
            url=e["url"],
            type=e.get("type", "course"),
            platform=e.get("platform", ""),
            description=e.get("description"),
        )
        for e in entries
    ]


def build_resource_plan(
    tech_gaps: list[str],
    soft_gaps: list[str],
    transferable: list[str],
) -> list[SkillResources]:
    result: list[SkillResources] = []
    for skill in tech_gaps + soft_gaps + transferable:
        resources = get_resources_for_skill(skill)
        if resources:
            result.append(SkillResources(skill=skill, resources=resources))
    return result
