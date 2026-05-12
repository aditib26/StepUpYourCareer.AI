from fastapi import APIRouter
from app.services.mentor_service import match_mentors
from app.models.schemas import Mentor

router = APIRouter()


@router.post("/mentors/match", response_model=list[Mentor])
async def match(skills: list[str]):
    return match_mentors(skills)
