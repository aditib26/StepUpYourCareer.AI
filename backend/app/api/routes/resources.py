from fastapi import APIRouter
from app.services.resource_service import get_resources_for_skill
from app.models.schemas import Resource

router = APIRouter()


@router.get("/resources/{skill}", response_model=list[Resource])
async def get_resources(skill: str):
    return get_resources_for_skill(skill)
